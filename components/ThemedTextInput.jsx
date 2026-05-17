import { TextInput, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";

const ThemedTextInput = ({ style, ...props }) => {
  const { theme } = useTheme();

  return (
    <TextInput
      style={[
        {
          backgroundColor: theme.background,
          color: theme.text,
        },
        styles.textInput,
        style,
      ]}
      placeholderTextColor={theme.placeholderText}
      {...props}
    />
  );
};

export default ThemedTextInput;

const styles = StyleSheet.create({
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(128,128,128,0.35)",
    marginBottom: 10,
    width: "80%",
    minHeight: 56,
  },
});
