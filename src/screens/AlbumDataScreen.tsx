import AlbumDataControls from "@/components/AlbumDataControls";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import BackButton from "../components/BackButton";

export const AlbumDataScreen: React.FC<{
  navigate: (
    screen: "home" | "team" | "repetidas" | "data",
    params?: any,
  ) => void;
}> = ({ navigate }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dados do Álbum</Text>
      <AlbumDataControls />
      <BackButton onPress={() => navigate("home")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  back: { marginBottom: 8 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
});

export default AlbumDataScreen;
