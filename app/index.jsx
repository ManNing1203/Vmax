import { useEffect, useState, useRef } from "react";
import { Animated, StyleSheet, View, Dimensions } from "react-native";
import { Redirect } from "expo-router";
import Svg, { Circle, Path } from "react-native-svg";

import ThemedView from "../components/ThemedView";
import ThemedText from "../components/ThemedText";
import ThemedLogo from "../components/ThemedLogo";
import { useUser } from "../hooks/useUser";

const { width: W, height: H } = Dimensions.get("window");

const T = {
  accentGold: "#F5C842",
  accentGoldLight: "#FFF3C0",
  accentGoldMid: "#F5DFA0",
  accentPurpleDeep: "#534AB7",
  accentPurpleMid: "#7B74D4",
  coral: "#FF7058",
  teal: "#40596B",
  textDark: "#2C1810",
  textLight: "#BFA080",
  bgWarm: "#FFF8ED",
};

function SplashDecoration() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Circle
          cx={W * 0.92}
          cy={H * 0.08}
          r={180}
          fill={T.accentGold}
          fillOpacity={0.1}
        />
        <Circle
          cx={W * 0.08}
          cy={H * 0.88}
          r={140}
          fill={T.accentPurpleMid}
          fillOpacity={0.1}
        />
        <Circle
          cx={W * 0.15}
          cy={H * 0.18}
          r={55}
          fill={T.coral}
          fillOpacity={0.07}
        />
        <Circle
          cx={W * 0.88}
          cy={H * 0.78}
          r={70}
          fill={T.teal}
          fillOpacity={0.07}
        />
        <Path
          d={`M0,${H * 0.35} Q${W * 0.35},${H * 0.28} ${W * 0.65},${H * 0.38} Q${W},${H * 0.45} ${W},${H * 0.32}`}
          stroke={T.accentGold}
          strokeWidth="1.5"
          fill="none"
          strokeOpacity={0.25}
        />
        <Path
          d={`M0,${H * 0.72} Q${W * 0.4},${H * 0.65} ${W * 0.7},${H * 0.74} Q${W},${H * 0.8} ${W},${H * 0.7}`}
          stroke={T.accentPurpleMid}
          strokeWidth="1"
          fill="none"
          strokeOpacity={0.18}
        />
      </Svg>
    </View>
  );
}

function LoadingDot({ delay }) {
  const anim = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.35,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return <Animated.View style={[styles.dot, { opacity: anim }]} />;
}

const Home = () => {
  const { user, authChecked } = useUser();
  const [splashReady, setSplashReady] = useState(false);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.75)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const nameTranslateY = useRef(new Animated.Value(16)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const pillOpacity = useRef(new Animated.Value(0)).current;
  const pillScale = useRef(new Animated.Value(0.8)).current;
  const pillPulse = useRef(new Animated.Value(1)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => setSplashReady(true), 2400);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          damping: 14,
          stiffness: 90,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(nameTranslateY, {
          toValue: 0,
          damping: 18,
          stiffness: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(tagOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(pillOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(pillScale, {
          toValue: 1,
          damping: 12,
          stiffness: 100,
          useNativeDriver: true,
        }),
        Animated.timing(dotsOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pillPulse, {
          toValue: 1.06,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pillPulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    setTimeout(() => pulse.start(), 1500);

    return () => {
      clearTimeout(timer);
      pulse.stop();
    };
  }, []);

  if (authChecked && splashReady) {
    // Authenticated users go straight to the app; new users see onboarding
    return <Redirect href={user ? "/myGoal" : "/onboarding"} />;
  }

  return (
    <ThemedView style={styles.container}>
      <SplashDecoration />

      <Animated.View
        style={[
          styles.logoWrap,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <View style={styles.logoRingOuter}>
          <View style={styles.logoRingInner}>
            <ThemedLogo style={styles.logo} />
          </View>
        </View>
      </Animated.View>

      <Animated.View
        style={{
          opacity: nameOpacity,
          transform: [{ translateY: nameTranslateY }],
        }}
      >
        <ThemedText style={styles.appName} title={true}>
          Vmax
        </ThemedText>
      </Animated.View>

      <Animated.View style={[styles.tagWrap, { opacity: tagOpacity }]}>
        <View style={styles.tagLine} />
        <ThemedText style={styles.tagText}>
          Your Smart Money Companion
        </ThemedText>
        <View style={styles.tagLine} />
      </Animated.View>

      <Animated.View
        style={[
          styles.pillWrap,
          {
            opacity: pillOpacity,
            transform: [{ scale: Animated.multiply(pillScale, pillPulse) }],
          },
        ]}
      >
        <View style={styles.pill}>
          <ThemedText style={styles.pillText}>✦ Premium ✦</ThemedText>
        </View>
      </Animated.View>

      <Animated.View style={[styles.dotsRow, { opacity: dotsOpacity }]}>
        {[0, 1, 2].map((i) => (
          <LoadingDot key={i} delay={i * 180} />
        ))}
      </Animated.View>
    </ThemedView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: T.bgWarm,
  },
  logoWrap: { marginBottom: 28 },
  logoRingOuter: {
    width: 168,
    height: 168,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: T.accentGoldMid,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: T.accentGoldLight + "55",
    shadowColor: T.accentGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 10,
  },
  logoRingInner: {
    width: 148,
    height: 148,
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: T.accentGoldMid + "88",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFDF7",
    overflow: "hidden",
  },
  logo: { width: 120, height: 120 },
  appName: {
    fontSize: 52,
    fontWeight: "800",
    color: T.textDark,
    letterSpacing: -1.5,
    marginBottom: 14,
  },
  tagWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
    paddingHorizontal: 24,
  },
  tagLine: { flex: 1, height: 1, backgroundColor: T.accentGoldMid },
  tagText: {
    fontSize: 12,
    color: T.textLight,
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  pillWrap: { marginBottom: 48 },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: T.accentGold,
    borderWidth: 1,
    borderColor: T.accentGoldMid,
    shadowColor: T.accentGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "800",
    color: T.textDark,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  dotsRow: { flexDirection: "row", gap: 8, position: "absolute", bottom: 60 },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: T.accentPurpleDeep,
  },
});
