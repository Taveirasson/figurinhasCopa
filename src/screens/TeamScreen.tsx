import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton";
import { ListaFigurinhas } from "../components/ListaFigurinhas";
import { SearchBar } from "../components/SearchBar";
import { useAlbum } from "../context/AlbumContext";
import { useDebounce } from "../hooks/useDebounce";
import { useTheme } from "../theme";
import { filterFigurinhas } from "../utils/search";

export const TeamScreen: React.FC<{
  route: { teamId: string };
  navigate: (
    screen: "home" | "team" | "repetidas" | "data",
    params?: any,
  ) => void;
}> = ({ route, navigate }) => {
  const { album, toggleStatus } = useAlbum();
  const { colors } = useTheme();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const team = useMemo(
    () => album.find((t) => t.id === route.teamId),
    [album, route.teamId],
  );
  const filtered = useMemo(
    () => filterFigurinhas(team?.figurinhas ?? [], debouncedQuery),
    [team?.figurinhas, debouncedQuery],
  );
  const teamId = team?.id;
  const onToggle = useCallback(
    (id: string) => {
      if (teamId) toggleStatus(teamId, id);
    },
    [teamId, toggleStatus],
  );
  if (!team) return <Text>Time não encontrado</Text>;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BackButton onPress={() => navigate("home")} />
      <Text style={[styles.title, { color: colors.text }]}>{team.nome}</Text>
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
