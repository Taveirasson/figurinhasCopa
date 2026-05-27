import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton";
import { ListaFigurinhas } from "../components/ListaFigurinhas";
import { useAlbum } from "../context/AlbumContext";

export const RepetidasScreen: React.FC<{
  navigate: (
    screen: "home" | "team" | "repetidas" | "data",
    params?: any,
  ) => void;
}> = ({ navigate }) => {
  const { album, toggleStatus } = useAlbum();
  const repetidas = album.flatMap((t) =>
    t.figurinhas.filter((f) => f.status === "repetida"),
  );

  return (
    <View style={styles.container}>
      <BackButton onPress={() => navigate("home")} />
      <Text style={styles.title}>Repetidas ({repetidas.length})</Text>
      <ListaFigurinhas
        data={repetidas}
        onToggle={(id) => {
          // find teamId for this sticker
          const team = album.find((t) => t.figurinhas.some((f) => f.id === id));
          if (team) toggleStatus(team.id, id);
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
