import { useColorScheme } from "react-native";

export const light = {
  background: "#ffffff",
  surface: "#f3f3f3",
  text: "#000000",
  muted: "#666666",
  border: "#eee",
  primary: "#1e88e5",
  danger: "#e53935",
  buttonText: "#ffffff",
  cardBackground: "#eef6ff",
  cardBorder: "#d0e7ff",
};

export const dark = {
  background: "#0b0b0b",
  surface: "#121212",
  text: "#ffffff",
  muted: "#bdbdbd",
  border: "#2a2a2a",
  primary: "#64b5f6",
  danger: "#ef9a9a",
  buttonText: "#ffffff",
  cardBackground: "#112233",
  cardBorder: "#223344",
};

export const useTheme = () => {
  const scheme = useColorScheme();
  const colors = scheme === "dark" ? dark : light;
  return { scheme, colors };
};
