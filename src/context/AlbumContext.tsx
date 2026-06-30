import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Figurinha, Time, TIMES } from "../data/album";
import { mergeAlbumWithDefaults, parseAlbumPayload } from "./albumPersistence";
import { getNextStatus } from "./statusTransitions";

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
    let active = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!active) return;

        if (raw) {
          const stored = parseAlbumPayload(raw);
          if (!active) return;
          setAlbum(mergeAlbumWithDefaults(stored, TIMES));
        } else {
          if (!active) return;
          setAlbum(TIMES);
        }
      } catch (e) {
        if (!active) return;
        console.warn("Failed to load album", e);
        setAlbum(TIMES);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
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
      const imported = parseAlbumPayload(raw);
      const newAlbum = mergeAlbumWithDefaults(imported, TIMES);
      setAlbum(newAlbum);
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
    const next = getNextStatus(sticker.status);
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
