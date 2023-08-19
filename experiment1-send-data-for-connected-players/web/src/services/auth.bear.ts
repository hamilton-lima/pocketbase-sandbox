import PocketBase, { Admin, Record } from "pocketbase";
import jwtDecode from "jwt-decode";
import ms from "ms";
import { usePocketbaseBear } from "./pocketbase.bear";
import { create } from "zustand";

const fiveMinutesInMs = ms("5 minutes");
const twoMinutesInMs = ms("2 minutes");

export interface AuthBearData {
  pb: PocketBase;
  token: string;
  user: Record | Admin | null;
  register: (email: string, password: string) => Promise<Record>;
  login: Function;
  logout: Function;
  updateCurrentUser: Function;
  refreshSession: () => void;
  timer: Function;
}

// TODO: Error handling
export const useAuthBear = create<AuthBearData>((set, get) => ({
  pb: usePocketbaseBear.getState().pb,
  token: "",
  user: null,
  register: async (email: string, password: string) => {
    return await get()
      .pb.collection("users")
      .create({ email, password, passwordConfirm: password });
  },
  login: async (email: string, password: string) => {
    const result = await get()
      .pb.collection("users")
      .authWithPassword(email, password);
    get().updateCurrentUser();
    return result;
  },
  logout: () => {
    get().pb.authStore.clear();
  },
  updateCurrentUser: () => {
    set({ user: get().pb.authStore.model, token: get().pb.authStore.token });
  },
  refreshSession: async () => {
    if (!get().pb.authStore.isValid) return;
    console.log("Refreshing session");
    const decoded: any = jwtDecode(get().token);
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer = (decoded.exp + fiveMinutesInMs) / 1000;
    if (tokenExpiration < expirationWithBuffer) {
      await get().pb.collection("users").authRefresh();
    }
  },
  timer: () => {
    if (get().token) {
      setInterval(get().refreshSession, twoMinutesInMs);
    }
  },
}));
