import { Status } from "../data/album";

const STATUS_CYCLE: Record<Status, Status> = {
  falta: "tenho",
  tenho: "repetida",
  repetida: "falta",
};

export const getNextStatus = (currentStatus: Status): Status =>
  STATUS_CYCLE[currentStatus];
