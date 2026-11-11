import { StyleSheet, View } from "react-native";
import { useTheme } from "../hooks/useTheme";

const ThemedCard = ({ style, ...props }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[{ backgroundColor: theme.uiBackground }, styles.card, style]}
      {...props}
    />
  );
};

export default ThemedCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 5,
    padding: 10,
  },
});
