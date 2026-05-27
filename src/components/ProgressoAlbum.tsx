import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Time } from "../data/album";
import { useTheme } from "../theme";

export const ProgressoAlbum: React.FC<{ album: Time[] }> = ({ album }) => {
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
    <View style={[styles.row, { backgroundColor: colors.surface }]}>
      <Text style={[styles.item, { color: colors.text }]}>
        Total: {totals.total}
      </Text>
      <Text style={[styles.item, { color: colors.text }]}>
        Tenho: {totals.tenho}
      </Text>
      <Text style={[styles.item, { color: colors.text }]}>
        Repetidas: {totals.repetida}
      </Text>
      <Text style={[styles.item, { color: colors.text }]}>
        Faltam: {totals.total - totals.tenho}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
  },
  item: { fontWeight: "600" },
});
