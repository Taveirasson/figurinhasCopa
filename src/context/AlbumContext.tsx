import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Figurinha, Time, TIMES } from "../data/album";

const STORAGE_KEY = "@figurinha_album_v1";

interface AlbumContextValue {
  album: Time[];
  loading: boolean;
  toggleStatus: (teamId: string, stickerId: string) => void;
  setStatus: (
    teamId: string,
    stickerId: string,
    status: Figurinha["status"],
  ) => void;
  updateQuantity: (teamId: string, stickerId: string, delta: number) => void;
  setQuantity: (teamId: string, stickerId: string, quantity: number) => void;
  resetAlbum: () => void;
  exportAlbum: () => Promise<string>;
  importAlbum: (raw: string) => Promise<void>;
  clearAlbum: () => Promise<void>;
}

const AlbumContext = createContext<AlbumContextValue | undefined>(undefined);

export const AlbumProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [album, setAlbum] = useState<Time[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const stored: Time[] = JSON.parse(raw);
          // Merge stored album with default TIMES to ensure all teams/stickers exist
          const merged = TIMES.map((baseTeam) => {
            const storedTeam = stored.find((t) => t.id === baseTeam.id);
            if (!storedTeam) return baseTeam;
            // ensure all stickers from baseTeam exist, preserving stored status/nome/quantidade
            const stickers = baseTeam.figurinhas.map((bf) => {
              const sf = storedTeam.figurinhas.find((s) => s.id === bf.id);
              return sf
                ? {
                    ...bf,
                    nome: sf.nome ?? bf.nome,
                    status: sf.status,
                    quantidade: sf.quantidade,
                  }
                : bf;
            });
            return { ...baseTeam, figurinhas: stickers };
          });
          // Append any teams present in stored but not in base TIMES (preserve user data)
          const extraTeams = stored.filter(
            (t) => !TIMES.some((bt) => bt.id === t.id),
          );
          setAlbum([...merged, ...extraTeams]);
        } else {
          setAlbum(TIMES);
        }
      } catch (e) {
        console.warn("Failed to load album", e);
        setAlbum(TIMES);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(album)).catch((e) =>
        console.warn("Failed to save album", e),
      );
    }
  }, [album, loading]);

  const exportAlbum = async () => {
    try {
      const data = JSON.stringify(album, null, 2);
      return data;
    } catch (e) {
      console.warn("Failed to export album", e);
      throw e;
    }
  };

  const importAlbum = async (raw: string) => {
    try {
      const parsed = JSON.parse(raw) as any;
      // support both { album: [...] } and raw array
      const imported: Time[] = Array.isArray(parsed)
        ? parsed
        : (parsed.album ?? parsed.data ?? []);

      // Merge imported with default TIMES to ensure base stickers exist
      const merged = TIMES.map((baseTeam) => {
        const importedTeam = imported.find((t) => t.id === baseTeam.id);
        if (!importedTeam) return baseTeam;
        const stickers = baseTeam.figurinhas.map((bf) => {
          const sf = importedTeam.figurinhas?.find((s: any) => s.id === bf.id);
          return sf
            ? {
                ...bf,
                nome: sf.nome ?? bf.nome,
                status: sf.status ?? bf.status,
                quantidade: sf.quantidade ?? bf.quantidade,
              }
            : bf;
        });
        return { ...baseTeam, figurinhas: stickers };
      });
      const extraTeams = imported.filter(
        (t) => !TIMES.some((bt) => bt.id === t.id),
      );
      const newAlbum = [...merged, ...extraTeams];
      setAlbum(newAlbum);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newAlbum));
    } catch (e) {
      console.warn("Failed to import album", e);
      throw e;
    }
  };

  const clearAlbum = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setAlbum(TIMES);
    } catch (e) {
      console.warn("Failed to clear album", e);
      throw e;
    }
  };

  const setStatus = (
    teamId: string,
    stickerId: string,
    status: Figurinha["status"],
  ) => {
    setAlbum((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              figurinhas: t.figurinhas.map((f) =>
                f.id === stickerId ? { ...f, status } : f,
              ),
            }
          : t,
      ),
    );
  };

  const toggleStatus = (teamId: string, stickerId: string) => {
    const team = album.find((t) => t.id === teamId);
    if (!team) return;
    const sticker = team.figurinhas.find((f) => f.id === stickerId);
    if (!sticker) return;
    const next =
      sticker.status === "falta"
        ? "tenho"
        : sticker.status === "tenho"
          ? "repetida"
          : "falta";
    setStatus(teamId, stickerId, next);
  };

  const updateQuantity = (teamId: string, stickerId: string, delta: number) => {
    setAlbum((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              figurinhas: t.figurinhas.map((f) =>
                f.id === stickerId
                  ? {
                      ...f,
                      quantidade: Math.max(0, (f.quantidade ?? 0) + delta),
                    }
                  : f,
              ),
            }
          : t,
      ),
    );
  };

  const setQuantity = (teamId: string, stickerId: string, quantity: number) => {
    setAlbum((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              figurinhas: t.figurinhas.map((f) =>
                f.id === stickerId
                  ? { ...f, quantidade: Math.max(0, quantity) }
                  : f,
              ),
            }
          : t,
      ),
    );
  };

  const resetAlbum = () => setAlbum(TIMES);

  return (
    <AlbumContext.Provider
      value={{
        album,
        loading,
        toggleStatus,
        setStatus,
        updateQuantity,
        setQuantity,
        resetAlbum,
        exportAlbum,
        importAlbum,
        clearAlbum,
      }}
    >
      {children}
    </AlbumContext.Provider>
  );
};

export const useAlbum = () => {
  const ctx = useContext(AlbumContext);
  if (!ctx) throw new Error("useAlbum must be used within AlbumProvider");
  return ctx;
};
