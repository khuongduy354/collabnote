import { Operation } from "./operations";

export type RoomDB = {
  [key: string]: Room;
};
export type Room = {
  synced_ops: Operation[];
};
