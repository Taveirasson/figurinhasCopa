import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../theme";

interface Props {
  onPress: () => void;
  label?: string;
}

export const BackButton: React.FC<Props> = ({ onPress, label = "Voltar" }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View
        style={[
          styles.inner,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Text style={[styles.arrow, { color: colors.primary }]}>←</Text>
        <Text style={[styles.label, { color: colors.primary }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: undefined,
    borderWidth: 1,
    borderColor: undefined,
    justifyContent: "center",
  },
  arrow: { fontSize: 16, marginRight: 8 },
  label: { fontWeight: "600" },
});

export default BackButton;
