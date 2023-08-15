import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import PocketBase, { Record, RecordSubscription } from "pocketbase";
import { useInterval } from "usehooks-ts";
import jwtDecode from "jwt-decode";
import ms from "ms";

const BASE_URL = "http://127.0.0.1:8080";
const fiveMinutesInMs = ms("5 minutes");
const twoMinutesInMs = ms("2 minutes");

export interface PocketContextData {
  register: Function;
  login: Function;
  logout: Function;
  joinSession: () => Promise<Record | undefined>;
  leaveSession: (sessionID: string) => void;
  updateSession: (sessionID: string, data: object) => void;
  user: object | null;
  token: string;
  pb: PocketBase | null;
  sessions: Record[];
}

const EMPTY_STATE: PocketContextData = {
  register: () => {},
  login: () => {},
  logout: () => {},
  joinSession: async () => {
    return undefined;
  },
  leaveSession: () => {},
  updateSession: () => {},
  user: null,
  token: "",
  pb: null,
  sessions: [],
};

const EMPTY_SESSIONS: Record[] = [];
const PocketContext = createContext<PocketContextData>(EMPTY_STATE);

export const PocketProvider = ({ children }: any) => {
  const pb = useMemo(() => {
    const result = new PocketBase(BASE_URL);
    result.autoCancellation(false);
    return result;
  }, []);

  const [token, setToken] = useState(pb.authStore.token);
  const [user, setUser] = useState(pb.authStore.model);
  const [sessions, setSessions] = useState(EMPTY_SESSIONS);
  let unsubscribe = () => {};

  const componentWillUnmount = () => {
    unsubscribe();
  };

  async function init() {
    const all = await pb.collection("sessions").getFullList({
      sort: "created",
      expand: "user",
    });
    setSessions(all);

    unsubscribe = await pb
      .collection("sessions")
      .subscribe("*", async (e: RecordSubscription) => {
        console.log("Sessions collection updated", e);
        if (e.action == "create") {
          e.record.expand = await pb.collection("users").getOne(e.record.user);
          setSessions((current) => [...current, e.record]);
        }
        if (e.action == "delete") {
          setSessions((current) =>
            current.filter((value) => value.id != e.record.id)
          );
        }
        if (e.action == "update") {
          setSessions((current) => {
            const index = current.findIndex((value) => value.id == e.record.id);
            console.log("index found", index);
            if (index) {
              current[index] = e.record;
            }
            return current;
          });
        }
        console.log("sessions", sessions);
      });
  }

  useEffect(() => {
    init();
    return pb.authStore.onChange((token, model) => {
      setToken(token);
      setUser(model);
    });
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    return await pb
      .collection("users")
      .create({ email, password, passwordConfirm: password });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    return await pb.collection("users").authWithPassword(email, password);
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
  }, []);

  const joinSession = async (): Promise<Record | undefined> => {
    if (user) {
      return await pb
        .collection("sessions")
        .create({ user: user.id, data: { counter: 0 } });
    }
  };

  const leaveSession = async (sessionID: string) => {
    if (user) {
      return await pb.collection("sessions").delete(sessionID);
    }
  };

  const updateSession = async (sessionID: string, data: object) => {
    if (user) {
      return await pb.collection("sessions").update(sessionID, { data });
    }
  };

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    const decoded: any = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer = (decoded.exp + fiveMinutesInMs) / 1000;
    if (tokenExpiration < expirationWithBuffer) {
      await pb.collection("users").authRefresh();
    }
  }, [token]);

  useInterval(refreshSession, token ? twoMinutesInMs : null);

  return (
    <PocketContext.Provider
      value={{
        register,
        login,
        logout,
        joinSession,
        leaveSession,
        updateSession,
        user,
        token,
        pb,
        sessions,
      }}
    >
      {children}
    </PocketContext.Provider>
  );
};

export const usePocket = () => useContext(PocketContext);
