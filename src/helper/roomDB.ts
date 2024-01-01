import { RoomDB } from "../types/roomPayload";

export function addRoom(db: RoomDB, roomName: string) {
  if (db[roomName] === undefined) {
    db[roomName] = { synced_ops: [] };
    return true;
  }
  return false;
}
export function getRoom(db: RoomDB, roomName: string) {
  return db[roomName] !== undefined ? db[roomName] : null;
}
