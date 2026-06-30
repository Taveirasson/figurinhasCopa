import { Figurinha, Status, Time } from "../data/album";

export interface AlbumStats {
  total: number;
  tenho: number;
  repetida: number;
  faltando: number;
}

export interface TeamStats {
  total: number;
  tenho: number;
  repetidas: number;
  faltando: number;
}

export const selectFigurinhasByStatus = (
  album: Time[],
  statuses: Status | Status[],
): Figurinha[] => {
  const accepted = Array.isArray(statuses) ? statuses : [statuses];
  return album.flatMap((team) =>
    team.figurinhas.filter((figurinha) => accepted.includes(figurinha.status)),
  );
};

export const selectFaltando = (album: Time[]): Figurinha[] =>
  selectFigurinhasByStatus(album, "falta");

export const selectTenho = (album: Time[]): Figurinha[] =>
  selectFigurinhasByStatus(album, ["tenho", "repetida"]);

export const selectRepetidas = (album: Time[]): Figurinha[] =>
  selectFigurinhasByStatus(album, "repetida");

export const selectTeamByStickerId = (
  album: Time[],
  stickerId: string,
): Time | undefined =>
  album.find((team) =>
    team.figurinhas.some((figurinha) => figurinha.id === stickerId),
  );

export const selectTeamIdByStickerId = (
  album: Time[],
  stickerId: string,
): string | undefined => selectTeamByStickerId(album, stickerId)?.id;

export const selectAlbumStats = (album: Time[]): AlbumStats => {
  const totals = album.reduce(
    (acc, team) => {
      acc.total += team.figurinhas.length;

      team.figurinhas.forEach((figurinha) => {
        if (figurinha.status === "tenho" || figurinha.status === "repetida") {
          acc.tenho += 1;
        }
        if (figurinha.status === "repetida") {
          acc.repetida += figurinha.quantidade || 1;
        }
      });

      return acc;
    },
    { total: 0, tenho: 0, repetida: 0 },
  );

  return {
    ...totals,
    faltando: totals.total - totals.tenho,
  };
};

export const selectTeamStats = (team: Time): TeamStats => {
  const total = team.figurinhas.length;
  const tenho = team.figurinhas.filter(
    (figurinha) =>
      figurinha.status === "tenho" || figurinha.status === "repetida",
  ).length;
  const repetidas = team.figurinhas.filter(
    (figurinha) => figurinha.status === "repetida",
  ).length;

  return {
    total,
    tenho,
    repetidas,
    faltando: total - tenho,
  };
};
