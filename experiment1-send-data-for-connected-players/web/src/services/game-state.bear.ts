import PocketBase, { Admin, Record, RecordSubscription } from "pocketbase";
import { usePocketbaseBear } from "./pocketbase.bear";
import { create } from "zustand";
import { useAuthBear } from "./auth.bear";
import { Logger } from "../utils/logger";

export interface GameStateBearData {
  logger: Logger;
  pb: PocketBase;
  user: () => Record | Admin | null;
  sessions: Record[];
  joinSession: () => Promise<Record | undefined>;
  leaveSession: (sessionID: string) => void;
  updateSession: (sessionID: string, data: object) => void;
  currentList: () => void;
  unsubscribe: () => void;
}

// TODO: how to call unsubscribe(); ??
// TODO: Handle the subscription outside of the component, as useEffect will be fired multiple times
// https://react.dev/learn/synchronizing-with-effects#not-an-effect-initializing-the-application

export const useGameStateBear = create<GameStateBearData>((set, get) => ({
  logger: new Logger("gamestate 🐻"),
  pb: usePocketbaseBear.getState().pb,
  user: () => useAuthBear.getState().user,
  sessions: [],
  joinSession: async (): Promise<Record | undefined> => {
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
  currentList: async () => {
    const all = await get().pb.collection("sessions").getFullList({
      sort: "created",
      expand: "user",
    });
    set({ sessions: all });
  },
  unsubscribe: async () => {
    const result = await get()
      .pb.collection("sessions")
      .subscribe("*", async (e: RecordSubscription) => {
        get().logger.log("Sessions collection updated", e);
        if (e.action === "create") {
          e.record.expand = await get()
            .pb.collection("users")
            .getOne(e.record.user);
          set({ sessions: [...get().sessions, e.record] });
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

    return result;
  },
}));
