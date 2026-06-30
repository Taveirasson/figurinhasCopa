import { Route } from "@/navigation/types";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { selectAlbumInsights, selectAlbumStats } from "../context/selectors";
import { Time } from "../data/album";
import { useTheme } from "../theme";

const STATUS_COLORS = {
  tenho: "#4caf50",
  faltam: "#d32f2f",
  repetidas: "#ff9800",
};

const fmtPercent = (v: number) =>
  v >= 100 ? "100%" : `${v.toFixed(v < 10 ? 1 : 0)}%`;

export const ProgressoAlbum: React.FC<{
  album: Time[];
  navigate: (name: Route["name"], params?: any) => void;
}> = ({ album, navigate }) => {
  const { colors } = useTheme();
  const totals = useMemo(() => selectAlbumStats(album), [album]);
  const insights = useMemo(() => selectAlbumInsights(album), [album]);

  const percentLabel = fmtPercent(insights.percent);
  const barWidth = `${Math.min(100, Math.max(0, insights.percent))}%` as const;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerLabel, { color: colors.muted }]}>
            Progresso do álbum
          </Text>
          <Text style={[styles.headerValue, { color: colors.text }]}>
            {totals.tenho}
            <Text style={[styles.headerMuted, { color: colors.muted }]}>
              {" "}
              / {totals.total}
            </Text>
          </Text>
        </View>
        <View
          style={[
            styles.percentBadge,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Text style={[styles.percentText, { color: colors.primary }]}>
            {percentLabel}
          </Text>
        </View>
      </View>

      <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.barFill,
            { width: barWidth, backgroundColor: colors.primary },
          ]}
        />
      </View>

      <View style={styles.chipsRow}>
        <TouchableOpacity
          onPress={() => navigate("tenho")}
          style={[
            styles.chip,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View
            style={[styles.chipDot, { backgroundColor: STATUS_COLORS.tenho }]}
          />
          <View>
            <Text style={[styles.chipLabel, { color: colors.muted }]}>
              Tenho
            </Text>
            <Text style={[styles.chipValue, { color: colors.text }]}>
              {totals.tenho}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigate("faltando")}
          style={[
            styles.chip,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View
            style={[styles.chipDot, { backgroundColor: STATUS_COLORS.faltam }]}
          />
          <View>
            <Text style={[styles.chipLabel, { color: colors.muted }]}>
              Faltam
            </Text>
            <Text style={[styles.chipValue, { color: colors.text }]}>
              {totals.faltando}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigate("repetidas")}
          style={[
            styles.chip,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View
            style={[
              styles.chipDot,
              { backgroundColor: STATUS_COLORS.repetidas },
            ]}
          />
          <View>
            <Text style={[styles.chipLabel, { color: colors.muted }]}>
              Repetidas
            </Text>
            <Text style={[styles.chipValue, { color: colors.text }]}>
              {totals.repetida}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.insightsRow}>
        <View
          style={[
            styles.insight,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.insightLabel, { color: colors.muted }]}>
            Times completos
          </Text>
          <Text style={[styles.insightValue, { color: colors.text }]}>
            {insights.timesCompletos}
            <Text style={[styles.insightMuted, { color: colors.muted }]}>
              {" "}
              / {insights.timesTotal}
            </Text>
          </Text>
        </View>

        <View
          style={[
            styles.insight,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.insightLabel, { color: colors.muted }]}>
            Média por time
          </Text>
          <Text style={[styles.insightValue, { color: colors.text }]}>
            {insights.mediaPorTime.toFixed(1)}
          </Text>
        </View>

        {insights.topTime && (
          <TouchableOpacity
            onPress={() =>
              insights.topTime &&
              navigate("team", { teamId: insights.topTime.id })
            }
            style={[
              styles.insight,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.insightLabel, { color: colors.muted }]}>
              Mais completo
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.insightValue, { color: colors.text }]}
            >
              {insights.topTime.nome}
            </Text>
            <Text style={[styles.insightSub, { color: colors.primary }]}>
              {insights.topTime.tenho}/{insights.topTime.total} ·{" "}
              {fmtPercent(insights.topTime.percent)}
            </Text>
          </TouchableOpacity>
        )}

        {insights.bottomTime && (
          <TouchableOpacity
            onPress={() =>
              insights.bottomTime &&
              navigate("team", { teamId: insights.bottomTime.id })
            }
            style={[
              styles.insight,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.insightLabel, { color: colors.muted }]}>
              Menos completo
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.insightValue, { color: colors.text }]}
            >
              {insights.bottomTime.nome}
            </Text>
            <Text style={[styles.insightSub, { color: colors.danger }]}>
              {insights.bottomTime.tenho}/{insights.bottomTime.total} ·{" "}
              {fmtPercent(insights.bottomTime.percent)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: { flexShrink: 1 },
  headerLabel: { fontSize: 12, fontWeight: "600", letterSpacing: 0.4 },
  headerValue: { fontSize: 22, fontWeight: "800", marginTop: 2 },
  headerMuted: { fontSize: 14, fontWeight: "600" },
  percentBadge: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  percentText: { fontSize: 16, fontWeight: "800" },
  barTrack: {
    height: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexGrow: 1,
    flexBasis: 100,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  chipDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  chipLabel: { fontSize: 11, fontWeight: "600", letterSpacing: 0.3 },
  chipValue: { fontSize: 16, fontWeight: "800" },
  insightsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  insight: {
    flexGrow: 1,
    flexBasis: 140,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  insightLabel: { fontSize: 11, fontWeight: "600", letterSpacing: 0.3 },
  insightValue: { fontSize: 15, fontWeight: "800", marginTop: 2 },
  insightMuted: { fontSize: 12, fontWeight: "600" },
  insightSub: { fontSize: 12, fontWeight: "700", marginTop: 2 },
});
