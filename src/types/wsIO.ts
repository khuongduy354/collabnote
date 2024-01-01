import { Operation } from "./operations";

export type SyncTextReceive = {
  op: Operation;
  rid: number;
};
export type SyncTextEmit = {
  op: Operation;
  rid: number;
  socketId: string;
};
