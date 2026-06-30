import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton";
import { ListaFigurinhas } from "../components/ListaFigurinhas";
import { useAlbum } from "../context/AlbumContext";
import { selectFaltando, selectTeamIdByStickerId } from "../context/selectors";
import { useTheme } from "../theme";

type RouteName = "home" | "team" | "repetidas" | "data" | "faltando" | "tenho";

export const FaltandoScreen: React.FC<{
  navigate: (name: RouteName, params?: any) => void;
}> = ({ navigate }) => {
  const { colors } = useTheme();
  const { album, toggleStatus } = useAlbum();
  const faltando = selectFaltando(album);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BackButton onPress={() => navigate("home")} />
      <Text style={[styles.title, { color: colors.text }]}>
        Faltando ({faltando.length})
      </Text>
      <ListaFigurinhas
        data={faltando}
        onToggle={(id) => {
          const teamId = selectTeamIdByStickerId(album, id);
          if (teamId) toggleStatus(teamId, id);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  back: { marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
});
