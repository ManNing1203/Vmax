import { ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";

import ThemedView from "./ThemedView";

const ThemedLoader = ({ style, ...props }) => {
  const { theme } = useTheme();

  return (
    <ThemedView style={[styles.loader, style]} {...props}>
      <ActivityIndicator size="large" color={theme.text} />
    </ThemedView>
  );
};

export default ThemedLoader;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
