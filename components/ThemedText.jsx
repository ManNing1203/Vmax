import { Text } from "react-native";
import { useTheme } from "../hooks/useTheme";

const ThemedText = ({ style, title = false, ...props }) => {
  const { theme } = useTheme();

  const textColor = title ? theme.title : theme.text;

  return (
    <Text
      style={[
        { color: textColor, fontWeight: title ? "bold" : "normal" },
        style,
      ]}
      {...props}
    />
  );
};

export default ThemedText;
