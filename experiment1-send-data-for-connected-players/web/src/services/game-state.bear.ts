import PocketBase, {
  Admin,
  Record,
  RecordSubscription,
  UnsubscribeFunc,
} from "pocketbase";
import { usePocketbaseBear } from "./pocketbase.bear";
import { StoreApi, UseBoundStore, create } from "zustand";
import { useAuthBear } from "./auth.bear";
import { Logger } from "../utils/logger";
import { BehaviorSubject } from "rxjs";

export interface GameStateBearData {
  logger: Logger;
  pb: PocketBase;
  user: () => Record | Admin | null;
  sessions: Record[];
  findByID: (sessionID: string) => Record | undefined;
  joinSession: () => Promise<Record | undefined>;
  leaveSession: (sessionID: string) => void;
  updateSession: (sessionID: string, data: object) => void;
  refresh: () => void;
  subscribe: () => void;
  unsubscribe: UnsubscribeFunc | undefined;
  ready: BehaviorSubject<boolean>;
}

// TODO: how to call unsubscribe(); ??
// TODO: Handle the subscription outside of the component, as useEffect will be fired multiple times
// https://react.dev/learn/synchronizing-with-effects#not-an-effect-initializing-the-application

export const useGameStateBear = create<GameStateBearData>((set, get) => ({
  logger: new Logger("gamestate 🐻"),
  pb: usePocketbaseBear.getState().pb,
  user: () => useAuthBear.getState().user,
  sessions: [],
  findByID: (sessionID: string) => {
    const found = get().sessions.filter((value) => value.id === sessionID);
    get().logger.log("Found on search by ID", sessionID, found);
    if (Array.isArray(found) && found.length > 0) {
      return found[0];
    }
    return undefined;
  },
  joinSession: async (): Promise<Record | undefined> => {
    if (!get().ready.value) {
      get().logger.warn(
        "Still hibernating, please come back on spring (bear not ready, did you call subscribe?)"
      );
      return;
    }

    const user = get().user();
    if (user) {
      get().logger.log("Joining session");
      const result = await get()
        .pb.collection("sessions")
        .create({ user: user.id, data: { counter: 0 } });
      get().logger.log("Joinned session", result);
      return result;
    } else {
      get().logger.warn("User is not set, are you logged in?");
    }
  },
  leaveSession: async (sessionID: string) => {
    if (get().user()) {
      return await get().pb.collection("sessions").delete(sessionID);
    }
  },
  updateSession: async (sessionID: string, data: object) => {
    if (get().user()) {
      return await get().pb.collection("sessions").update(sessionID, { data });
    }
  },
  refresh: async () => {
    const all = await get().pb.collection("sessions").getFullList({
      sort: "created",
      expand: "user",
    });
    set({ sessions: all });
  },
  subscribe: async () => {
    const result = await get()
      .pb.collection("sessions")
      .subscribe("*", async (e: RecordSubscription) => {
        get().logger.log("Sessions collection updated", e);
        if (e.action === "create") {
          if (!get().findByID(e.record.id)) {
            get().logger.log("Session created event", e.record.id);
            e.record.expand = await get()
              .pb.collection("users")
              .getOne(e.record.user);

            set({ sessions: [...get().sessions, e.record] });
          } else {
            get().logger.log(
              "Session already exists won't create",
              e.record.id
            );
          }
        }
        if (e.action === "delete") {
          set({
            sessions: get().sessions.filter(
              (value) => value.id !== e.record.id
            ),
          });
        }
        if (e.action === "update") {
          const sessions = get().sessions;
          const index = sessions.findIndex((value) => value.id === e.record.id);
          get().logger.log("Found session at position", index);
          if (index) {
            sessions[index] = e.record;
          }
          // creates a new object in the state to force a UI refresh
          set({ sessions: [...sessions] });
        }
      });
    set({ unsubscribe: result });
    get().ready.next(true);
    get().logger.log("subscribe done, bear is ready");
  },
  unsubscribe: undefined,
  ready: new BehaviorSubject(false),
}));
