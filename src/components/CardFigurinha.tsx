import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAlbum } from "../context/AlbumContext";
import { Figurinha } from "../data/album";
import { useTheme } from "../theme";

export const CardFigurinha: React.FC<{
  figurinha: Figurinha;
  onToggle: () => void;
}> = ({ figurinha, onToggle }) => {
  const isRepe = figurinha.status === "repetida";
  const color =
    figurinha.status === "tenho"
      ? "#4caf50"
      : figurinha.status === "repetida"
        ? "#ff9800"
        : "#d32f2f";

  const { album, updateQuantity, setStatus } = useAlbum();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        isRepe && styles.cardRepe,
        { borderColor: colors.border },
      ]}
    >
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={[styles.badgeText, { color: colors.buttonText }]}>
          {figurinha.numero}
        </Text>
      </View>
      <View style={styles.info}>
        {isRepe ? (
          <>
            <Text style={[styles.title, { color: colors.text }]}>
              {figurinha.id} -{" "}
              {figurinha.nome ?? `${figurinha.pais} #${figurinha.numero}`}
            </Text>
            <View style={styles.repetidaActions}>
              <View style={styles.counterRow}>
                <TouchableOpacity
                  onPress={() => {
                    const current = Math.max(1, figurinha.quantidade ?? 1);
                    if (current <= 1) return;
                    const team = album.find((t) =>
                      t.figurinhas.some((f) => f.id === figurinha.id),
                    );
                    if (!team) return;
                    updateQuantity(team.id, figurinha.id, -1);
                  }}
                  disabled={(figurinha.quantidade ?? 1) <= 1}
                  style={[
                    styles.counterButton,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.cardBorder,
                      opacity: (figurinha.quantidade ?? 1) <= 1 ? 0.5 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.counterButtonText,
                      { color: colors.primary },
                    ]}
                  >
                    −
                  </Text>
                </TouchableOpacity>

                <View style={styles.countBox}>
                  <Text style={[styles.countText, { color: colors.text }]}>
                    {Math.max(1, figurinha.quantidade ?? 1)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    const team = album.find((t) =>
                      t.figurinhas.some((f) => f.id === figurinha.id),
                    );
                    if (!team) return;
                    updateQuantity(team.id, figurinha.id, 1);
                  }}
                  style={[
                    styles.counterButton,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.counterButtonText,
                      { color: colors.primary },
                    ]}
                  >
                    +
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  styles.smallTrocar,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.cardBorder,
                  },
                ]}
                onPress={() => {
                  const team = album.find((t) =>
                    t.figurinhas.some((f) => f.id === figurinha.id),
                  );
                  if (!team) return;
                  setStatus(team.id, figurinha.id, "falta");
                }}
              >
                <Text
                  style={[styles.smallTrocarText, { color: colors.primary }]}
                >
                  Trocar
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.title, { color: colors.text }]}>
              {figurinha.id} -{" "}
              {figurinha.nome ?? `${figurinha.pais} #${figurinha.numero}`}
            </Text>
            <Text style={[styles.status, { color: colors.muted }]}>
              Status: {figurinha.status}
            </Text>
          </>
        )}
      </View>
      {!isRepe && (
        <TouchableOpacity
          onPress={onToggle}
          style={[
            styles.action,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.smallTrocarText, { color: colors.primary }]}>
            Trocar
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: undefined,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontWeight: "700" },
  info: { flex: 1, marginLeft: 12 },
  title: { fontSize: 16, fontWeight: "600" },
  status: { marginTop: 4 },
  action: {
    padding: 8,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  actionText: {},
  counter: { flexDirection: "row", alignItems: "center" },
  counterButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  counterButtonText: { fontSize: 18, fontWeight: "700" },
  countBox: {
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: { fontWeight: "700" },
  counterWrap: { flexDirection: "row", alignItems: "center" },
  revertActions: { flexDirection: "row", marginLeft: 8 },
  revertButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
    marginLeft: 6,
  },
  revertText: { fontWeight: "700" },
  revertDanger: {},
  revertDangerText: {},
  bigToggle: {
    flexDirection: "column",
    marginLeft: 8,
    borderRadius: 8,
    overflow: "hidden",
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  bigToggleLeft: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 120,
  },
  bigToggleRight: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 120,
    marginTop: 6,
  },
  bigToggleLeftText: { fontWeight: "700", fontSize: 13 },
  bigToggleRightText: { fontWeight: "700", fontSize: 13 },
  bigToggleSingle: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  bigToggleSingleText: { fontWeight: "700" },
  cardRepe: { alignItems: "flex-start" },
  repetidaActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  counterRow: { flex: 1, flexDirection: "row", alignItems: "center" },
  smallTrocar: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  smallTrocarText: { fontWeight: "700" },
});
