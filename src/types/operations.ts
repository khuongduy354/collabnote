export enum OperationType {
  Delete = 0,
  Insert = 1,
}
export type Operation = {
  optype: OperationType;
  position: number;
  text?: string;
};
