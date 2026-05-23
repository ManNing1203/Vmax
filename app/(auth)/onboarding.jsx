/**
 * app/(auth)/onboarding.jsx
 *
 * 3-slide onboarding shown once between splash and login.
 * Swipeable via scroll or dot taps. "Skip" goes straight to login.
 * Uses the same T palette + SVG decoration as index.jsx splash.
 */

import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Circle, Ellipse, Path, Rect, Line, Polyline, G } from "react-native-svg";

import ThemedText from "../../components/ThemedText";
import ThemedView from "../../components/ThemedView";

const { width: W, height: H } = Dimensions.get("window");

const T = {
  accentGold:        "#F5C842",
  accentGoldLight:   "#FFF3C0",
  accentGoldMid:     "#F5DFA0",
  accentPurpleDeep:  "#534AB7",
  accentPurpleMid:   "#7B74D4",
  accentPurpleLight: "#EEEDFE",
  coral:             "#FF7058",
  coralLight:        "#FFF0EE",
  teal:              "#40596B",
  tealLight:         "#E6F0F5",
  textDark:          "#2C1810",
  textMid:           "#7A5C3C",
  textLight:         "#BFA080",
  bgWarm:            "#FFF8ED",
  bgCard:            "#FFFDF7",
  bgBorder:          "#F5DFA0",
  green:             "#4CAF50",
  greenLight:        "#E8F5E9",
};

// ─── Slide data ───────────────────────────────────────────────────────────────
const SLIDES = [
  {
    key: "expenses",
    accentColor: T.coral,
    accentLight: T.coralLight,
    bgOrb1: T.coral,
    bgOrb2: T.accentGold,
    pill: "Smart Tracking",
    title: "Know Where\nEvery Ringgit\nGoes",
    body: "Log expenses in seconds. Upload receipts or type manually — Vmax keeps your daily spending crystal clear.",
    illustration: <ExpenseIllustration />,
  },
  {
    key: "goals",
    accentColor: T.accentGold,
    accentLight: T.accentGoldLight,
    bgOrb1: T.accentGold,
    bgOrb2: T.teal,
    pill: "Goal Builder",
    title: "Grow Your\nSavings,\nOne Goal at a Time",
    body: "Set targets, watch progress fill up, and let Vmax auto-split your daily saveable amount across all goals.",
    illustration: <GoalsIllustration />,
  },
  {
    key: "group",
    accentColor: T.accentPurpleDeep,
    accentLight: T.accentPurpleLight,
    bgOrb1: T.accentPurpleMid,
    bgOrb2: T.coral,
    pill: "Together Mode",
    title: "Save Together,\nWin Together",
    body: "Create group goals with friends or family. Share progress, stay accountable, celebrate milestones as one.",
    illustration: <GroupIllustration />,
  },
];

// ─── Illustrations ────────────────────────────────────────────────────────────

function ExpenseIllustration() {
  return (
    <Svg width={260} height={220} viewBox="0 0 260 220">
      {/* Receipt card */}
      <Rect x={40} y={10} width={180} height={170} rx={18} fill={T.bgCard} stroke={T.bgBorder} strokeWidth={2} />
      {/* Red top strip */}
      <Rect x={40} y={10} width={180} height={36} rx={18} fill={T.coral} fillOpacity={0.15} />
      <Rect x={40} y={28} width={180} height={18} fill={T.coral} fillOpacity={0.15} />
      {/* Receipt icon top */}
      <Circle cx={130} cy={28} r={10} fill={T.coral} fillOpacity={0.9} />
      <Line x1={126} y1={28} x2={134} y2={28} stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      <Line x1={130} y1={24} x2={130} y2={32} stroke="#fff" strokeWidth={2} strokeLinecap="round" />
      {/* Row items */}
      {[
        { y: 65,  label: "Groceries",  amt: "RM 42.50", color: T.teal   },
        { y: 95,  label: "Transport",  amt: "RM 12.00", color: T.accentPurpleMid },
        { y: 125, label: "Food & Bev", amt: "RM 28.90", color: T.coral  },
      ].map(({ y, label, amt, color }) => (
        <G key={y}>
          <Circle cx={62} cy={y} r={7} fill={color} fillOpacity={0.18} />
          <Circle cx={62} cy={y} r={3.5} fill={color} />
          <Rect x={76} y={y - 5} width={70} height={10} rx={4} fill={T.bgBorder} fillOpacity={0.6} />
          <Rect x={170} y={y - 5} width={38} height={10} rx={4} fill={color} fillOpacity={0.18} />
        </G>
      ))}
      {/* Total bar */}
      <Rect x={50} y={148} width={160} height={22} rx={8} fill={T.coral} fillOpacity={0.12} />
      <Rect x={58} y={153} width={50} height={8} rx={3} fill={T.coral} fillOpacity={0.4} />
      <Rect x={160} y={153} width={42} height={8} rx={3} fill={T.coral} fillOpacity={0.7} />

      {/* Floating badge top-right */}
      <Rect x={168} y={0} width={72} height={28} rx={10} fill={T.coral} />
      <Rect x={174} y={7} width={32} height={6} rx={3} fill="#fff" fillOpacity={0.9} />
      <Rect x={174} y={17} width={22} height={4} rx={2} fill="#fff" fillOpacity={0.6} />

      {/* Small coin bottom-left */}
      <Circle cx={30} cy={170} r={18} fill={T.accentGold} fillOpacity={0.9} />
      <Circle cx={30} cy={170} r={13} fill={T.accentGold} stroke="#fff" strokeWidth={1.5} fillOpacity={0} />
      <Rect x={27} y={164} width={6} height={12} rx={2} fill="#fff" fillOpacity={0.85} />
    </Svg>
  );
}

function GoalsIllustration() {
  const bars = [
    { x: 30,  h: 60,  color: T.accentPurpleMid, filled: 0.4  },
    { x: 78,  h: 100, color: T.accentGold,       filled: 0.75 },
    { x: 126, h: 80,  color: T.coral,            filled: 0.55 },
    { x: 174, h: 120, color: T.green,            filled: 1.0  },
  ];
  const baseY = 170;
  return (
    <Svg width={260} height={220} viewBox="0 0 260 220">
      {/* Grid lines */}
      {[40, 80, 120, 160].map((y) => (
        <Line key={y} x1={20} y1={y} x2={240} y2={y} stroke={T.bgBorder} strokeWidth={1} />
      ))}

      {bars.map(({ x, h, color, filled }) => (
        <G key={x}>
          {/* Track */}
          <Rect x={x} y={baseY - h} width={42} height={h} rx={10} fill={color} fillOpacity={0.12} />
          {/* Fill */}
          <Rect
            x={x} y={baseY - h * filled} width={42} height={h * filled}
            rx={10} fill={color} fillOpacity={filled >= 1 ? 1 : 0.75}
          />
          {/* % label */}
          <Rect x={x + 4} y={baseY - h * filled - 20} width={34} height={16} rx={6} fill={color} fillOpacity={0.15} />
          <Rect x={x + 8} y={baseY - h * filled - 15} width={20} height={6} rx={3} fill={color} fillOpacity={0.6} />
          {/* Checkmark on completed */}
          {filled >= 1 && (
            <G>
              <Circle cx={x + 21} cy={baseY - h - 14} r={10} fill={T.green} />
              <Polyline points={`${x+16},${baseY-h-14} ${x+20},${baseY-h-10} ${x+27},${baseY-h-19}`}
                fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </G>
          )}
        </G>
      ))}

      {/* X axis */}
      <Line x1={20} y1={baseY} x2={240} y2={baseY} stroke={T.bgBorder} strokeWidth={1.5} />

      {/* Floating card top-left */}
      <Rect x={0} y={0} width={90} height={34} rx={12} fill={T.bgCard} stroke={T.bgBorder} strokeWidth={1.5} />
      <Circle cx={16} cy={17} r={7} fill={T.accentGold} fillOpacity={0.3} />
      <Circle cx={16} cy={17} r={4} fill={T.accentGold} />
      <Rect x={28} y={10} width={36} height={6} rx={3} fill={T.bgBorder} />
      <Rect x={28} y={20} width={24} height={5} rx={2} fill={T.accentGold} fillOpacity={0.4} />
    </Svg>
  );
}

function GroupIllustration() {
  const avatars = [
    { cx: 80,  cy: 100, r: 32, fill: T.accentPurpleLight, inner: T.accentPurpleMid },
    { cx: 130, cy: 75,  r: 38, fill: T.accentGoldLight,   inner: T.accentGold      },
    { cx: 180, cy: 100, r: 32, fill: T.coralLight,        inner: T.coral           },
  ];
  return (
    <Svg width={260} height={220} viewBox="0 0 260 220">
      {/* Connection lines */}
      <Line x1={80} y1={100} x2={130} y2={75}  stroke={T.accentPurpleMid} strokeWidth={1.5} strokeOpacity={0.3} strokeDasharray="4 3" />
      <Line x1={130} y1={75} x2={180} y2={100} stroke={T.accentGold}      strokeWidth={1.5} strokeOpacity={0.3} strokeDasharray="4 3" />
      <Line x1={80} y1={100} x2={180} y2={100} stroke={T.coral}           strokeWidth={1}   strokeOpacity={0.2} strokeDasharray="4 3" />

      {/* Avatar circles */}
      {avatars.map(({ cx, cy, r, fill, inner }) => (
        <G key={cx}>
          <Circle cx={cx} cy={cy} r={r}     fill={fill}  />
          <Circle cx={cx} cy={cy - 6} r={r * 0.38} fill={inner} fillOpacity={0.7} />
          <Ellipse cx={cx} cy={cy + r * 0.55} rx={r * 0.55} ry={r * 0.3} fill={inner} fillOpacity={0.5} />
        </G>
      ))}

      {/* Shared progress bar below */}
      <Rect x={40} y={152} width={180} height={16} rx={8} fill={T.bgBorder} />
      <Rect x={40} y={152} width={126} height={16} rx={8} fill={T.accentPurpleMid} fillOpacity={0.8} />
      <Circle cx={166} cy={160} r={9} fill={T.accentPurpleDeep} />
      <Line x1={162} y1={160} x2={170} y2={160} stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
      <Line x1={166} y1={156} x2={166} y2={164} stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />

      {/* Label pill */}
      <Rect x={80} y={176} width={100} height={24} rx={10} fill={T.accentPurpleDeep} fillOpacity={0.1} />
      <Rect x={90} y={183} width={50} height={8}  rx={4}  fill={T.accentPurpleMid}  fillOpacity={0.4} />
      <Rect x={148} y={183} width={24} height={8} rx={4}  fill={T.accentGold}       fillOpacity={0.6} />

      {/* Star sparkles */}
      {[[220, 30], [20, 50], [240, 140]].map(([x, y], i) => (
        <G key={i}>
          <Line x1={x} y1={y-7} x2={x} y2={y+7} stroke={T.accentGold} strokeWidth={1.5} strokeLinecap="round" />
          <Line x1={x-7} y1={y} x2={x+7} y2={y} stroke={T.accentGold} strokeWidth={1.5} strokeLinecap="round" />
        </G>
      ))}
    </Svg>
  );
}

// ─── Background decoration per slide ─────────────────────────────────────────
function SlideDecoration({ orb1, orb2 }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Circle cx={W * 0.88} cy={H * 0.12} r={160} fill={orb1} fillOpacity={0.08} />
        <Circle cx={W * 0.12} cy={H * 0.82} r={130} fill={orb2} fillOpacity={0.09} />
        <Circle cx={W * 0.5}  cy={H * 0.5}  r={200} fill={orb1} fillOpacity={0.03} />
        <Path
          d={`M0,${H*0.4} Q${W*0.4},${H*0.32} ${W*0.7},${H*0.42} Q${W},${H*0.48} ${W},${H*0.36}`}
          stroke={orb1} strokeWidth="1.2" fill="none" strokeOpacity={0.2}
        />
      </Svg>
    </View>
  );
}

// ─── Dot indicator ────────────────────────────────────────────────────────────
function Dots({ count, active, accentColor, onPress }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: count }).map((_, i) => (
        <Pressable key={i} onPress={() => onPress(i)} hitSlop={10}>
          <Animated.View
            style={[
              styles.dot,
              {
                backgroundColor: i === active ? accentColor : T.bgBorder,
                width: i === active ? 24 : 8,
              },
            ]}
          />
        </Pressable>
      ))}
    </View>
  );
}

// ─── Main onboarding screen ───────────────────────────────────────────────────
export default function OnboardingScreen() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / W);
    setActiveIndex(idx);
  };

  const goTo = (idx) => {
    scrollRef.current?.scrollTo({ x: idx * W, animated: true });
    setActiveIndex(idx);
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      goTo(activeIndex + 1);
    } else {
      router.replace("/login");
    }
  };

  const slide = SLIDES[activeIndex];

  return (
    <ThemedView style={[styles.root, { backgroundColor: T.bgWarm }]}>
      <SlideDecoration orb1={slide.bgOrb1} orb2={slide.bgOrb2} />

      {/* Skip button */}
      <Pressable
        style={styles.skipBtn}
        onPress={() => router.replace("/login")}
      >
        <ThemedText style={styles.skipText}>Skip</ThemedText>
      </Pressable>

      {/* Swipeable slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s, i) => (
          <View key={s.key} style={styles.slide}>
            {/* Illustration card */}
            <View style={[styles.illustrationCard, { borderColor: s.accentLight ?? T.bgBorder }]}>
              <View style={[styles.illustrationBg, { backgroundColor: s.accentLight }]}>
                {s.illustration}
              </View>
            </View>

            {/* Pill */}
            <View style={[styles.pill, { backgroundColor: s.accentColor }]}>
              <ThemedText style={styles.pillText}>{s.pill}</ThemedText>
            </View>

            {/* Title */}
            <ThemedText style={[styles.title, { color: T.textDark }]}>
              {s.title}
            </ThemedText>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: s.accentColor, opacity: 0.3 }]} />
              <View style={[styles.dividerDot,  { backgroundColor: s.accentColor }]} />
              <View style={[styles.dividerLine, { backgroundColor: s.accentColor, opacity: 0.3 }]} />
            </View>

            {/* Body */}
            <ThemedText style={styles.body}>{s.body}</ThemedText>
          </View>
        ))}
      </ScrollView>

      {/* Bottom controls */}
      <View style={styles.bottomBar}>
        <Dots
          count={SLIDES.length}
          active={activeIndex}
          accentColor={slide.accentColor}
          onPress={goTo}
        />

        <Pressable
          style={[styles.nextBtn, { backgroundColor: slide.accentColor }]}
          onPress={handleNext}
        >
          <ThemedText style={styles.nextBtnText}>
            {activeIndex === SLIDES.length - 1 ? "Get Started  →" : "Next  →"}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  skipBtn: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.bgBorder,
    backgroundColor: T.bgCard,
  },
  skipText: {
    fontSize: 13,
    fontWeight: "600",
    color: T.textLight,
  },

  slide: {
    width: W,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 160,
  },

  // Illustration
  illustrationCard: {
    borderRadius: 32,
    borderWidth: 2,
    overflow: "hidden",
    marginBottom: 32,
    shadowColor: "#2C1810",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  illustrationBg: {
    width: W - 80,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },

  // Pill
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  // Title
  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
    textAlign: "center",
    lineHeight: 38,
    marginBottom: 16,
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
  },
  dividerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // Body
  body: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    color: T.textMid,
    paddingHorizontal: 8,
  },

  // Bottom bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingBottom: 48,
    paddingTop: 16,
    gap: 20,
    alignItems: "center",
    backgroundColor: "transparent",
  },

  // Dots
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },

  // Next button
  nextBtn: {
    width: "100%",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  nextBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});