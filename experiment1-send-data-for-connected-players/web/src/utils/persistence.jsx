import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8080");
pb.autoCancellation(false);

async function saveEvent(name, data) {
  return await pb.collection("events").create({ name: name, details: data });
}

export async function saveNavigation(data) {
  return saveEvent("navigation", data);
}
