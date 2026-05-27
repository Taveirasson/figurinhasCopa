import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ProgressoAlbum } from "../components/ProgressoAlbum";
import { useAlbum } from "../context/AlbumContext";
import { useTheme } from "../theme";

export const HomeScreen: React.FC<{
  navigate: (
    screen: "home" | "team" | "repetidas" | "data" | "faltando" | "tenho",
    params?: any,
  ) => void;
}> = ({ navigate }) => {
  const { album, loading, toggleStatus } = useAlbum();
  const { colors } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Meu Álbum - Copa 2026
      </Text>
      <ProgressoAlbum album={album} />
      <View style={styles.list}>
        {album.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.team, { borderColor: colors.border }]}
            onPress={() => navigate("team", { teamId: t.id })}
          >
            <Text style={[styles.teamText, { color: colors.text }]}>
              {t.nome} - {t.id}
            </Text>
            {(() => {
              const total = t.figurinhas.length;
              const tenho = t.figurinhas.filter(
                (f) => f.status === "tenho" || f.status === "repetida",
              ).length;
              const repetidas = t.figurinhas.filter(
                (f) => f.status === "repetida",
              ).length;
              return (
                <Text style={[styles.teamSub, { color: colors.muted }]}>
                  Total: {total} — Tenho: {tenho} — Repetidas: {repetidas}
                </Text>
              );
            })()}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.link} onPress={() => navigate("tenho")}>
        <Text style={[styles.linkText, { color: colors.primary }]}>
          Ver adquiridas
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigate("repetidas")}
      >
        <Text style={[styles.linkText, { color: colors.primary }]}>
          Ver repetidas
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.link}
        onPress={() => navigate("faltando")}
      >
        <Text style={[styles.linkText, { color: colors.primary }]}>
          Ver faltando
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.link, { marginTop: 8 }]}
        onPress={() => navigate("data")}
      >
        <Text style={[styles.linkText, { color: colors.primary }]}>
          Gerenciar dados do álbum
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  search: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  searchItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: undefined,
    flexDirection: "row",
    alignItems: "center",
  },
  searchTeam: { fontSize: 12, marginRight: 8 },
  list: { marginTop: 12 },
  team: { padding: 12, borderBottomWidth: 1 },
  teamText: { fontSize: 16, fontWeight: "600" },
  teamSub: {},
  link: { marginTop: 16, padding: 12, alignItems: "center" },
  linkText: { fontWeight: "600" },
});
