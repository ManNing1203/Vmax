import { Tabs } from "expo-router";
import { View, Pressable, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserOnly from "../../components/auth/UserOnly";
import { useTheme } from "../../hooks/useTheme";
import FloatingChatButton from "../../components/chatbot/FloatingChatButton";

const T = {
  accentGold:        "#F5C842",
  accentGoldMid:     "#F5DFA0",
  accentPurpleDeep:  "#534AB7",
  accentPurpleLight: "#EEEDFE",
  textDark:          "#2C1810",
  textLight:         "#BFA080",
  bgCard:            "#FFFDF7",
  bgWarm:            "#FFF8ED",
  bgBorder:          "#F5DFA0",
};

const TABS = [
  { name: "myGoal",    label: "Home",     icon: "home"    },
  { name: "groupGoal", label: "Groups",   icon: "people"  },
  { name: "expenses",  label: "Expenses", icon: "receipt" },
  { name: "profile",   label: "Profile",  icon: "person"  },
];

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    // Wrap both the floating button and the tab bar together
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <FloatingChatButton />

      <View style={styles.barWrapper}>
        <View style={styles.bar}>
          {state.routes
            .filter((r) => TABS.some((t) => t.name === r.name))
            .map((route) => {
              const focused = state.routes[state.index].name === route.name;
              const tab = TABS.find((t) => t.name === route.name);
              return (
                <Pressable
                  key={route.key}
                  onPress={() => {
                    const event = navigation.emit({
                      type: "tabPress",
                      target: route.key,
                      canPreventDefault: true,
                    });
                    if (!focused && !event.defaultPrevented)
                      navigation.navigate(route.name);
                  }}
                  onLongPress={() =>
                    navigation.emit({ type: "tabLongPress", target: route.key })
                  }
                  style={styles.tab}
                  android_ripple={null}
                >
                  {focused && <View style={styles.activePill} />}
                  <Ionicons
                    name={focused ? tab.icon : `${tab.icon}-outline`}
                    size={22}
                    color={focused ? T.accentPurpleDeep : T.textLight}
                    style={focused && styles.activeIcon}
                  />
                  {focused && <View style={styles.activeDot} />}
                </Pressable>
              );
            })}
        </View>
      </View>
    </View>
  );
}

export default function DashboardLayout() {
  const { theme } = useTheme();
  return (
    <UserOnly>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        {TABS.map((tab) => (
          <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.label }} />
        ))}
        <Tabs.Screen name="chatbot" options={{ href: null, title: "Chatbot" }} />
      </Tabs>
    </UserOnly>
  );
}

const styles = StyleSheet.create({
  barWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
    paddingTop: 10,
    backgroundColor: "transparent",
  },
  bar: {
    flexDirection: "row",
    backgroundColor: T.bgCard,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: T.bgBorder,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    shadowColor: "#2C1810",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    position: "relative",
  },
  activePill: {
    position: "absolute",
    width: 46,
    height: 40,
    borderRadius: 14,
    backgroundColor: T.accentPurpleLight,
    borderWidth: 1,
    borderColor: "rgba(83,74,183,0.15)",
  },
  activeIcon: { zIndex: 1 },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.accentGold,
    marginTop: 4,
    zIndex: 1,
  },
});