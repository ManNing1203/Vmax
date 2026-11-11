import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";

const ThemedView = ({
  style,
  safe = false,
  safeEdges = ["right", "bottom", "left"],
  ...props
}) => {
  const { theme } = useTheme();

  const Container = safe ? SafeAreaView : View;

  const safeAreaProps = safe && safeEdges ? { edges: safeEdges } : {};

  return (
    <Container
      style={[{ backgroundColor: theme.background }, styles.container, style]}
      {...safeAreaProps}
      {...props}
    />
  );
};

export default ThemedView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
