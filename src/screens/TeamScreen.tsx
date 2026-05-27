import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton";
import { ListaFigurinhas } from "../components/ListaFigurinhas";
import { useAlbum } from "../context/AlbumContext";
import { useTheme } from "../theme";

export const TeamScreen: React.FC<{
  route: { teamId: string };
  navigate: (
    screen: "home" | "team" | "repetidas" | "data",
    params?: any,
  ) => void;
}> = ({ route, navigate }) => {
  const { album, toggleStatus } = useAlbum();
  const { colors } = useTheme();
  const team = album.find((t) => t.id === route.teamId);
  if (!team) return <Text>Time não encontrado</Text>;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BackButton onPress={() => navigate("home")} />
      <Text style={[styles.title, { color: colors.text }]}>{team.nome}</Text>
      <ListaFigurinhas
        data={team.figurinhas}
        onToggle={(id) => toggleStatus(team.id, id)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  back: { marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
});
