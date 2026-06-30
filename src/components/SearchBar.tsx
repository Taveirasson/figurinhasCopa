import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../theme";

export const SearchBar: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}> = ({ value, onChangeText, placeholder = "Buscar figurinha..." }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")} style={styles.clear}>
          <Text style={[styles.clearText, { color: colors.muted }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  clear: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  clearText: {
    fontSize: 14,
    lineHeight: 16,
  },
});
