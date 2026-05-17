import { createContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import * as SecureStore from "expo-secure-store";

import { Colors } from "../constants/Colors";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState("system");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await SecureStore.getItemAsync("themeMode");
        if (saved) {
          setThemeMode(saved);
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTheme();
  }, []);

  // Save theme whenever it changes
  useEffect(() => {
    if (isLoaded) {
      SecureStore.setItemAsync("themeMode", themeMode).catch((error) => {
        console.error("Failed to save theme:", error);
      });
    }
  }, [themeMode, isLoaded]);

  const colorScheme =
    themeMode === "system" ? (systemScheme ?? "light") : themeMode;
  const theme = Colors[colorScheme] ?? Colors.light;

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      colorScheme,
      theme,
    }),
    [themeMode, colorScheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
