import PocketBase from "pocketbase";
import { create } from "zustand";

const BASE_URL = "http://127.0.0.1:8080";

export interface PocketBaseBearData {
  pb: PocketBase;
}

function connect2PocketBase() {
  const result = new PocketBase(BASE_URL);
  result.autoCancellation(false);
  return result;
}

export const usePocketbaseBear = create<PocketBaseBearData>(() => ({
  pb: connect2PocketBase(),
}));

