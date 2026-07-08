import { Route } from "@/navigation/types";
import { HomeScreen } from "@/screens/HomeScreen";
import { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AlbumProvider } from "../context/AlbumContext";
import { AlbumDataScreen } from "../screens/AlbumDataScreen";
import { FaltandoScreen } from "../screens/FaltandoScreen";
import { RepetidasScreen } from "../screens/RepetidasScreen";
import { TeamScreen } from "../screens/TeamScreen";
import { TenhoScreen } from "../screens/TenhoScreen";

export default function Index() {
  const scheme = useColorScheme();
  const colors =
    scheme === "dark"
      ? { background: "#0b0b0b", text: "#ffffff" }
      : { background: "#ffffff", text: "#000000" };

  // Set default Text color globally so components without explicit color adapt
  if (Text && (Text as any).defaultProps == null) {
    (Text as any).defaultProps = { style: { color: colors.text } };
  } else if (Text) {
    (Text as any).defaultProps.style = { color: colors.text };
  }

  // Ensure TextInput uses proper text color and placeholder color in dark mode
  if (TextInput && (TextInput as any).defaultProps == null) {
    (TextInput as any).defaultProps = {
      style: { color: colors.text },
      placeholderTextColor: scheme === "dark" ? "#999" : "#666",
    };
  } else if (TextInput) {
    (TextInput as any).defaultProps.style = { color: colors.text };
    (TextInput as any).defaultProps.placeholderTextColor =
      scheme === "dark" ? "#999" : "#666";
  }

  const [route, setRoute] = useState<Route>({ name: "home" });
  const historyRef = useRef<Route[]>([]);
  const homeScrollYRef = useRef(0);

  const navigate = (name: Route["name"], params?: any) => {
    // push current route to history unless navigating to home (reset)
    if (name === "home") {
      historyRef.current = [];
      setRoute({ name: "home" });
      return;
    }
    historyRef.current.push(route);
    if (name === "team")
      setRoute({ name: "team", params: { teamId: params?.teamId } });
    if (name === "repetidas") setRoute({ name: "repetidas" });
    if (name === "faltando") setRoute({ name: "faltando" });
    if (name === "tenho") setRoute({ name: "tenho" });
    if (name === "data") setRoute({ name: "data" });
  };

  useEffect(() => {
    const onBack = () => {
      const prev = historyRef.current.pop();
      if (prev) {
        setRoute(prev);
        return true; // handled
      }
      return false; // exit app
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBack,
    );
    return () => subscription.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaProvider>
      <AlbumProvider>
        <SafeAreaView
          style={[styles.container, { backgroundColor: colors.background }]}
          edges={["top", "bottom"]}
        >
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle={scheme === "dark" ? "light-content" : "dark-content"}
          />
          {route.name === "home" && (
            <HomeScreen
              navigate={navigate}
              initialScrollY={homeScrollYRef.current}
              onScrollYChange={(scrollY) => {
                homeScrollYRef.current = scrollY;
              }}
            />
          )}
          {route.name === "team" && (
            <TeamScreen route={route.params} navigate={navigate} />
          )}
          {route.name === "repetidas" && (
            <RepetidasScreen navigate={navigate} />
          )}
          {route.name === "data" && <AlbumDataScreen navigate={navigate} />}
          {route.name === "faltando" && <FaltandoScreen navigate={navigate} />}
          {route.name === "tenho" && <TenhoScreen navigate={navigate} />}
        </SafeAreaView>
      </AlbumProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
