import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { ThemeProvider } from "../contexts/ThemeContext";
import { UserProvider } from "../contexts/UserContext";
import { useTheme } from "../hooks/useTheme";

function RootNavigator() {
  const { theme, colorScheme } = useTheme();

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerStyle: { backgroundColor: theme.navBackground },
          headerTintColor: theme.title,
          headerShown: false,
        }}
      >
        {/* Groups */}
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(dashboard)" />

        {/* Individual Screens */}
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <RootNavigator />
      </UserProvider>
    </ThemeProvider>
  );
}
