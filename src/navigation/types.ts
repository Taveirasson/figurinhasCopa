export type Route =
  | { name: "home" }
  | { name: "team"; params: { teamId: string } }
  | { name: "repetidas" }
  | { name: "data" }
  | { name: "faltando" }
  | { name: "tenho" };
