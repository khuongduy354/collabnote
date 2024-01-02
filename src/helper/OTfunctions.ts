import { Operation, OperationType } from "../types/operations";

export const Tii = (remoteOp: Operation, localOp: Operation) => {
  if (remoteOp.position >= localOp.position) {
    remoteOp.position += 1;
  }
  return remoteOp;
};
export const Tid = (remoteOp: Operation, localOp: Operation) => {
  if (remoteOp.position >= localOp.position) {
    remoteOp.position -= 1;
  }
  return remoteOp;
};
export const Tdd = (remoteOp: Operation, localOp: Operation) => {
  if (remoteOp.position >= localOp.position) {
    remoteOp.position -= 1;
  }
  return remoteOp;
};
export const Tdi = (remoteOp: Operation, localOp: Operation) => {
  if (remoteOp.position >= localOp.position) {
    remoteOp.position += 1;
  }
  return remoteOp;
};

export const applyOT = (remoteOp: Operation, localOp: Operation) => {
  if (remoteOp.optype === OperationType.Insert) {
    if (localOp.optype === OperationType.Insert) return Tii(remoteOp, localOp);
    if (localOp.optype === OperationType.Delete) return Tid(remoteOp, localOp);
  }
  if (remoteOp.optype === OperationType.Delete) {
    if (localOp.optype === OperationType.Delete) return Tdd(remoteOp, localOp);
    if (localOp.optype === OperationType.Insert) return Tdi(remoteOp, localOp);
  }

  // incase of no match, do nothing
  return remoteOp;
};

export const opsToText = (opsList: Operation[]) => {
  let result = [];
  for (let idx in opsList) {
    let op = opsList[idx];
    switch (op.optype) {
      case OperationType.Insert:
        result[op.position] = op.text;
        break;
      case OperationType.Delete:
        result[op.position] = "";
        break;
      default:
        throw new Error("Invalid optypes");
    }
  }
  result = result.map((val) => (val === undefined ? "" : val));
  return result.join("");
};
