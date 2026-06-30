import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton";
import { ListaFigurinhas } from "../components/ListaFigurinhas";
import { useAlbum } from "../context/AlbumContext";
import { selectRepetidas, selectTeamIdByStickerId } from "../context/selectors";

export const RepetidasScreen: React.FC<{
  navigate: (
    screen: "home" | "team" | "repetidas" | "data",
    params?: any,
  ) => void;
}> = ({ navigate }) => {
  const { album, toggleStatus } = useAlbum();
  const repetidas = selectRepetidas(album);

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigate("home")} />
      <Text style={styles.title}>Repetidas ({repetidas.length})</Text>
      <ListaFigurinhas
        data={repetidas}
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
