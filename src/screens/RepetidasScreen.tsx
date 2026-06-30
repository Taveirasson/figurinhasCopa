import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton";
import { ListaFigurinhas } from "../components/ListaFigurinhas";
import { SearchBar } from "../components/SearchBar";
import { useAlbum } from "../context/AlbumContext";
import { selectRepetidas } from "../context/selectors";
import { useDebounce } from "../hooks/useDebounce";
import { useTheme } from "../theme";
import { filterFigurinhas } from "../utils/search";

export const RepetidasScreen: React.FC<{
  navigate: (
    screen: "home" | "team" | "repetidas" | "data",
    params?: any,
  ) => void;
}> = ({ navigate }) => {
  const { colors } = useTheme();
  const { album, stickerToTeamId, toggleStatus } = useAlbum();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const repetidas = useMemo(() => selectRepetidas(album), [album]);
  const filtered = useMemo(
    () => filterFigurinhas(repetidas, debouncedQuery),
    [repetidas, debouncedQuery],
  );

  const onToggle = useCallback(
    (id: string) => {
      const teamId = stickerToTeamId[id];
      if (teamId) toggleStatus(teamId, id);
    },
    [stickerToTeamId, toggleStatus],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BackButton onPress={() => navigate("home")} />
      <Text style={[styles.title, { color: colors.text }]}>
        Repetidas ({repetidas.length})
      </Text>
      <SearchBar value={query} onChangeText={setQuery} />
      <ListaFigurinhas data={filtered} onToggle={onToggle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  back: { marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
});
