import { Route } from "@/navigation/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { selectAlbumStats } from "../context/selectors";
import { Time } from "../data/album";
import { useTheme } from "../theme";

export const ProgressoAlbum: React.FC<{
  album: Time[];
  navigate: (name: Route["name"], params?: any) => void;
}> = ({ album, navigate }) => {
  const totals = selectAlbumStats(album);

  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.row}>
        <Text style={[styles.item, { color: colors.text }]}>
          Total: {totals.total}
        </Text>
        <TouchableOpacity
          onPress={() => navigate("tenho")}
          style={styles.itemTouchable}
        >
          <Text style={[styles.itemLink, { color: colors.primary }]}>
            Tenho: {totals.tenho}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate("repetidas")}
          style={styles.itemTouchable}
        >
          <Text style={[styles.itemLink, { color: colors.primary }]}>
            Repetidas: {totals.repetida}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate("faltando")}
          style={styles.itemTouchable}
        >
          <Text style={[styles.itemLink, { color: colors.primary }]}>
            Faltam: {totals.faltando}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12 },
  row: { flexDirection: "row", justifyContent: "space-around" },
  item: { fontWeight: "600" },
  itemTouchable: { alignItems: "center", paddingVertical: 4 },
  itemLink: { fontWeight: "700" },
});
