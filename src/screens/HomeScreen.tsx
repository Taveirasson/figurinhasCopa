import React, { useCallback, useEffect, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ProgressoAlbum } from "../components/ProgressoAlbum";
import { useAlbum } from "../context/AlbumContext";
import { selectTeamStats } from "../context/selectors";
import { useTheme } from "../theme";

export const HomeScreen: React.FC<{
  navigate: (
    screen: "home" | "team" | "repetidas" | "data" | "faltando" | "tenho",
    params?: any,
  ) => void;
  initialScrollY?: number;
  onScrollYChange?: (scrollY: number) => void;
}> = ({ navigate, initialScrollY = 0, onScrollYChange }) => {
  const { album, loading, toggleStatus } = useAlbum();
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const didRestoreScrollRef = useRef(false);

  const restoreScrollPosition = useCallback(() => {
    if (didRestoreScrollRef.current || initialScrollY <= 0) return;

    didRestoreScrollRef.current = true;
    scrollViewRef.current?.scrollTo({
      y: initialScrollY,
      animated: false,
    });
  }, [initialScrollY]);

  useEffect(() => {
    didRestoreScrollRef.current = false;

    const frame = requestAnimationFrame(restoreScrollPosition);
    return () => cancelAnimationFrame(frame);
  }, [restoreScrollPosition]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScrollYChange?.(event.nativeEvent.contentOffset.y);
    },
    [onScrollYChange],
  );

  const getBadgeColors = (percent: number) => {
    if (percent >= 80) {
      return { text: "#2e7d32" };
    }
    if (percent >= 40) {
      return { text: "#ef6c00" };
    }
    return { text: "#c62828" };
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Meu Álbum - Copa 2026
        </Text>
        <ProgressoAlbum album={album} navigate={navigate} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        onContentSizeChange={restoreScrollPosition}
        onLayout={restoreScrollPosition}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.list}>
          {album.map((t) => {
            const teamStats = selectTeamStats(t);
            const percent =
              teamStats.total === 0
                ? 0
                : Math.round((teamStats.tenho / teamStats.total) * 100);
            const badgeColors = getBadgeColors(percent);
            const progressWidth = `${percent}%` as const;

            return (
              <TouchableOpacity
                key={t.id}
                style={[styles.team, { borderColor: colors.border }]}
                onPress={() => navigate("team", { teamId: t.id })}
              >
                <View style={styles.teamHeader}>
                  <Text style={[styles.teamText, { color: colors.text }]}>
                    {t.nome} - {t.id}
                  </Text>
                  <View
                    style={[
                      styles.teamBadge,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.teamBadgeText,
                        { color: badgeColors.text },
                      ]}
                    >
                      {percent}%
                    </Text>
                  </View>
                </View>

                <Text style={[styles.teamSub, { color: colors.muted }]}>
                  Total: {teamStats.total} — Tenho: {teamStats.tenho} —
                  Faltantes: {teamStats.faltando} — Repetidas:{" "}
                  {teamStats.repetidas}
                </Text>

                <View
                  style={[
                    styles.teamProgressTrack,
                    { backgroundColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.teamProgressFill,
                      {
                        backgroundColor: badgeColors.text,
                        width: progressWidth,
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.link, { marginTop: 8 }]}
          onPress={() => navigate("data")}
        >
          <Text style={[styles.linkText, { color: colors.primary }]}>
            Gerenciar dados do álbum
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { padding: 16 },
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
  teamHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  teamText: { fontSize: 16, fontWeight: "600" },
  teamBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  teamBadgeText: { fontSize: 12, fontWeight: "800" },
  teamSub: {},
  teamProgressTrack: {
    height: 6,
    borderRadius: 999,
    marginTop: 10,
    overflow: "hidden",
  },
  teamProgressFill: {
    height: "100%",
    borderRadius: 999,
  },
  link: { marginTop: 16, padding: 12, alignItems: "center" },
  linkText: { fontWeight: "600" },
});
