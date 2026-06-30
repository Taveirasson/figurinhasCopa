import { Time, TIMES } from "../data/album";

export const parseAlbumPayload = (raw: string): Time[] => {
  const parsed = JSON.parse(raw) as unknown;
  let candidate: unknown = null;

  if (Array.isArray(parsed)) {
    candidate = parsed;
  }

  if (!candidate && parsed && typeof parsed === "object") {
    const parsedRecord = parsed as { album?: unknown; data?: unknown };
    if (Array.isArray(parsedRecord.album)) {
      candidate = parsedRecord.album;
    }
    if (!candidate && Array.isArray(parsedRecord.data)) {
      candidate = parsedRecord.data;
    }
  }

  if (!candidate) {
    throw new Error(
      "Invalid album payload: expected array or object with album/data array",
    );
  }

  const candidateArray = candidate as unknown[];

  const isValidTimeArray = candidateArray.every((team) => {
    if (!team || typeof team !== "object") return false;
    const maybeTeam = team as {
      id?: unknown;
      nome?: unknown;
      figurinhas?: unknown;
    };
    if (
      typeof maybeTeam.id !== "string" ||
      typeof maybeTeam.nome !== "string" ||
      !Array.isArray(maybeTeam.figurinhas)
    ) {
      return false;
    }

    return maybeTeam.figurinhas.every((figurinha) => {
      if (!figurinha || typeof figurinha !== "object") return false;
      const maybeFigurinha = figurinha as {
        id?: unknown;
        pais?: unknown;
        numero?: unknown;
        status?: unknown;
        quantidade?: unknown;
      };

      if (
        typeof maybeFigurinha.id !== "string" ||
        typeof maybeFigurinha.pais !== "string" ||
        typeof maybeFigurinha.numero !== "number" ||
        (maybeFigurinha.status !== "falta" &&
          maybeFigurinha.status !== "tenho" &&
          maybeFigurinha.status !== "repetida")
      ) {
        return false;
      }

      if (
        maybeFigurinha.quantidade !== undefined &&
        typeof maybeFigurinha.quantidade !== "number"
      ) {
        return false;
      }

      return true;
    });
  });

  if (!isValidTimeArray) {
    throw new Error("Invalid album payload: malformed teams or stickers");
  }

  return candidateArray as Time[];
};

export const mergeAlbumWithDefaults = (
  source: Time[],
  defaults: Time[] = TIMES,
): Time[] => {
  const merged = defaults.map((baseTeam) => {
    const sourceTeam = source.find((team) => team.id === baseTeam.id);
    if (!sourceTeam) return baseTeam;

    const stickers = baseTeam.figurinhas.map((baseSticker) => {
      const sourceSticker = sourceTeam.figurinhas?.find(
        (sticker) => sticker.id === baseSticker.id,
      );

      return sourceSticker
        ? {
            ...baseSticker,
            status: sourceSticker.status ?? baseSticker.status,
            quantidade: sourceSticker.quantidade ?? baseSticker.quantidade,
          }
        : baseSticker;
    });

    return { ...baseTeam, figurinhas: stickers };
  });

  const extraTeams = source.filter(
    (team) => !defaults.some((baseTeam) => baseTeam.id === team.id),
  );

  return [...merged, ...extraTeams];
};
