import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import PocketBase, { Record } from "pocketbase";
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
  user: object | null;
  token: string;
  pb: PocketBase | null;
}

const EMPTY_STATE: PocketContextData = {
  register: () => {},
  login: () => {},
  logout: () => {},
  joinSession: async () => {
    return undefined;
  },
  leaveSession: () => {},
  user: null,
  token: "",
  pb: null,
};
const PocketContext = createContext<PocketContextData>(EMPTY_STATE);

export const PocketProvider = ({ children }: any) => {
  const pb = useMemo(() => new PocketBase(BASE_URL), []);

  const [token, setToken] = useState(pb.authStore.token);
  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
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
        user,
        token,
        pb,
      }}
    >
      {children}
    </PocketContext.Provider>
  );
};

export const usePocket = () => useContext(PocketContext);
