// components/ui/PremiumHeader.jsx
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../hooks/useTheme";

const PT = Platform.OS === "ios" ? 52 : (StatusBar.currentHeight ?? 24) + 12;

const ACCENT_GOLD        = "#F5C842";
const ACCENT_GOLD_LIGHT  = "#FDE98A";
const ACCENT_GOLD_MID    = "#F5DFA0";
const ACCENT_PURPLE_DEEP = "#534AB7";
const ACCENT_PURPLE_MID  = "#7B74D4";

/**
 * PremiumHeader — theme-aware
 *
 * @param {string}   title          - Screen title
 * @param {string}   subtitle       - Optional subtitle beneath title
 * @param {boolean}  showBell       - Show notification bell (default true)
 * @param {boolean}  showAction     - Show right-side action button (default false)
 * @param {string}   actionIcon     - Ionicons name for the action button (default "add")
 * @param {function} onBellPress    - Bell press handler
 * @param {function} onActionPress  - Action button press handler
 */
export default function PremiumHeader({
  title = "Screen",
  subtitle,
  showBell = true,
  showAction = false,
  actionIcon = "add",
  onBellPress,
  onActionPress,
}) {
  const { theme, colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // Adaptive colors
  const bgGradient   = isDark
    ? ["#1A1730", "#1E1B3A", "#211E40"]
    : ["#FFFFFF", "#FAF7FF", "#F5F2FF"];
  const titleColor   = isDark ? "#F0EDFF" : "#1A1340";
  const subtitleColor= isDark ? "#9590C8" : "#9590C8";
  const iconBtnBg    = isDark ? "rgba(83,74,183,0.25)" : "#EEEDFE";
  const iconBtnBorder= isDark ? "rgba(83,74,183,0.3)"  : "rgba(83,74,183,0.12)";
  const badgeBorder  = isDark ? "#1A1730" : "#EEEDFE";
  const wrapperBg    = isDark ? "#1A1730" : "#FFFFFF";
  const shadowColor  = isDark ? "#000"    : "#534AB7";

  return (
    <View style={[styles.wrapper, { backgroundColor: wrapperBg, shadowColor }]}>
      {/* Gold shimmer line at top */}
      <LinearGradient
        colors={[ACCENT_GOLD, ACCENT_GOLD_LIGHT, ACCENT_GOLD]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.goldLine}
      />

      <LinearGradient
        colors={bgGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Left: title block */}
        <View style={styles.left}>
          <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
          ) : null}
        </View>

        {/* Right: action buttons */}
        <View style={styles.right}>
          {showBell && (
            <Pressable
              onPress={onBellPress}
              style={({ pressed }) => [
                styles.iconBtn,
                { backgroundColor: iconBtnBg, borderColor: iconBtnBorder },
                pressed && styles.iconBtnPressed,
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={ACCENT_PURPLE_DEEP}
              />
              <View style={[styles.badge, { borderColor: badgeBorder }]} />
            </Pressable>
          )}

          {showAction && (
            <Pressable
              onPress={onActionPress}
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && styles.actionBtnPressed,
              ]}
            >
              <LinearGradient
                colors={[ACCENT_PURPLE_MID, ACCENT_PURPLE_DEEP]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <Ionicons name={actionIcon} size={20} color="#FFF" />
              </LinearGradient>
            </Pressable>
          )}
        </View>
      </LinearGradient>

      {/* Bottom divider */}
      <LinearGradient
        colors={["transparent", ACCENT_GOLD_MID, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.divider}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 100,
  },
  goldLine: {
    height: 2,
    width: "100%",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: PT,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  left: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 31,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 12,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    position: "relative",
  },
  iconBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: ACCENT_GOLD,
    borderWidth: 1.5,
  },
  actionBtn: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: ACCENT_PURPLE_DEEP,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  actionGradient: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    width: "100%",
  },
});