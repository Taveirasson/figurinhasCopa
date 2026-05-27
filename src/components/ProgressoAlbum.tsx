import { Route } from "@/navigation/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Time } from "../data/album";
import { useTheme } from "../theme";

export const ProgressoAlbum: React.FC<{
  album: Time[];
  navigate: (name: Route["name"], params?: any) => void;
}> = ({ album, navigate }) => {
  const totals = album.reduce(
    (acc, t) => {
      acc.total += t.figurinhas.length;
      t.figurinhas.forEach((f) => {
        if (f.status === "tenho" || f.status === "repetida") acc.tenho += 1;
        if (f.status === "repetida") acc.repetida += f?.quantidade || 1;
      });
      return acc;
    },
    { total: 0, tenho: 0, repetida: 0 },
  );

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
            Faltam: {totals.total - totals.tenho}
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
