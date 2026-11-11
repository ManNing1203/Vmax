import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Svg, { Circle, Path } from "react-native-svg";

import ThemedScrollView from "../../../components/ThemedScrollView";
import ThemedText from "../../../components/ThemedText";
import Spacer from "../../../components/Spacer";
import ThemedTextInput from "../../../components/ThemedTextInput";
import ThemedButton from "../../../components/ThemedButton";
import {
  addExpenseRequest,
  scanExpensePicRequest,
} from "../../../services/expense";

const { width: SCREEN_W } = Dimensions.get("window");

const T = {
  accentGold: "#F5C842",
  accentGoldMid: "#F5DFA0",
  accentGoldLight: "#FFF3C0",
  accentPurple: "#7F77DD",
  accentPurpleDeep: "#534AB7",
  accentPurpleLight: "#EEEDFE",
  coral: "#FF7058",
  teal: "#40596B",
  textDark: "#2C1810",
  textMid: "#7A5C3C",
  textLight: "#BFA080",
  bgWarm: "#FFF8ED",
  bgBorder: "#F5DFA0",
  bgCard: "#FFFDF7",
};

function WarmDecoration() {
  return (
    <View style={s.decoWrap} pointerEvents="none">
      <Svg width={SCREEN_W} height={140} viewBox={`0 0 ${SCREEN_W} 140`}>
        <Circle
          cx={SCREEN_W * 0.9}
          cy={10}
          r={100}
          fill={T.accentGold}
          fillOpacity={0.07}
        />
        <Circle
          cx={SCREEN_W * 0.1}
          cy={100}
          r={55}
          fill={T.coral}
          fillOpacity={0.05}
        />
        <Path
          d={`M0,70 Q${SCREEN_W * 0.3},44 ${SCREEN_W * 0.65},62 Q${SCREEN_W},78 ${SCREEN_W},48`}
          stroke={T.accentGold}
          strokeWidth="1"
          fill="none"
          strokeOpacity={0.25}
        />
      </Svg>
    </View>
  );
}

function AddExpenses() {
  const { method } = useLocalSearchParams();
  const methodValue = Array.isArray(method) ? method[0] : method;
  const isUploadMode = methodValue !== "manual";

  return (
    <View style={[s.page, { backgroundColor: T.bgWarm }]}>
      <WarmDecoration />
      <ThemedScrollView contentContainerStyle={s.content}>
        <ExpenseForm isUploadMode={isUploadMode} />
      </ThemedScrollView>
      <CoinModal />
    </View>
  );
}

const SectionIconWrap = ({ name }) => (
  <View style={[s.sectionIconWrap, { backgroundColor: T.accentPurpleDeep }]}>
    <Ionicons name={name} size={18} color="#fff" />
  </View>
);

function ExpenseForm({ isUploadMode }) {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [receiptUri, setReceiptUri] = useState(null);
  const [scannedInfo, setScannedInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);

  const pickReceipt = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need gallery access to pick a receipt.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setReceiptUri(result.assets[0].uri);
    }
  };

  const handleScanReceipt = async () => {
    if (!receiptUri) {
      Alert.alert("Missing receipt", "Please choose a receipt image first.");
      return;
    }

    setScanning(true);
    try {
      const response = await scanExpensePicRequest({
        uri: receiptUri,
        name: `receipt-${Date.now()}.jpg`,
        type: "image/jpeg",
      });

      if (response?.success === false) {
        throw new Error(response?.message || "Unable to scan the receipt.");
      }

      const payload = response?.data ?? response;
      const scannedAmount =
        payload?.totalAmount ??
        payload?.total_amount ??
        payload?.amount ??
        payload?.price ??
        "";
      const scannedDescription =
        payload?.description ?? payload?.title ?? payload?.name ?? "";

      if (scannedAmount) {
        setAmount(String(scannedAmount));
      }
      if (scannedDescription) {
        setDescription(String(scannedDescription));
      }

      setScannedInfo(payload);
      Alert.alert("Receipt scanned", "We pulled details from the receipt.");
    } catch (err) {
      Alert.alert("Scan failed", err?.message || "Unable to scan the receipt.");
    } finally {
      setScanning(false);
    }
  };

  const handleSaveExpense = async () => {
    const normalizedDescription = description.trim();
    const parsedAmount = Number(amount);

    if (!normalizedDescription) {
      Alert.alert("Validation", "Expense description cannot be empty.");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Validation", "Expense amount must be a valid number.");
      return;
    }

    setSaving(true);
    try {
      const result = await addExpenseRequest(
        parsedAmount,
        normalizedDescription,
      );

      if (result?.success === false) {
        throw new Error(result?.message || "Failed to save expense.");
      }

      global.__showExpenseCoinModal?.();
      router.replace("/expenses");
    } catch (err) {
      Alert.alert("Error", err?.message || "Failed to save expense.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={s.sectionCard}>
      <View style={s.sectionHeader}>
        <SectionIconWrap name={isUploadMode ? "camera" : "list"} />
        <View style={s.sectionHeaderText}>
          <ThemedText style={s.sectionTitle}>
            {isUploadMode ? "Receipt Upload" : "Expense Details"}
          </ThemedText>
          <ThemedText style={s.sectionSubtitle}>
            {isUploadMode
              ? "Add a receipt and let the backend scan the details."
              : "Enter the amount and description manually."}
          </ThemedText>
        </View>
      </View>

      <Link
        style={s.switchLink}
        href={{
          pathname: "/expenses/add-expenses",
          params: { method: isUploadMode ? "manual" : "upload" },
        }}
      >
        <ThemedText style={s.switchText}>
          {isUploadMode
            ? "Don\'t have a receipt? Switch to manual entry"
            : "Prefer a scan? Try our receipt upload!"}
        </ThemedText>
      </Link>

      <Spacer height={20} />

      {isUploadMode ? (
        <View style={s.uploadArea}>
          <TouchableOpacity
            style={s.uploadBox}
            onPress={pickReceipt}
            activeOpacity={0.8}
          >
            {receiptUri ? (
              <Image
                source={{ uri: receiptUri }}
                style={s.preview}
                resizeMode="cover"
              />
            ) : (
              <>
                <Ionicons
                  name="receipt-outline"
                  size={44}
                  color={T.accentPurpleDeep}
                />
                <ThemedText style={s.uploadText}>
                  Tap to choose receipt image
                </ThemedText>
              </>
            )}
          </TouchableOpacity>

          {receiptUri ? (
            <TouchableOpacity
              onPress={() => setReceiptUri(null)}
              style={s.retakeRow}
            >
              <Ionicons name="refresh" size={16} color={T.coral} />
              <ThemedText style={s.retakeText}>Remove receipt</ThemedText>
            </TouchableOpacity>
          ) : null}

          {receiptUri ? (
            <ThemedButton
              style={s.secondaryButton}
              onPress={handleScanReceipt}
              disabled={scanning}
            >
              <ThemedText style={s.secondaryButtonText}>
                {scanning ? "Scanning..." : "Scan Receipt"}
              </ThemedText>
            </ThemedButton>
          ) : null}
        </View>
      ) : null}

      <ThemedTextInput
        placeholder="Expense description"
        multiline
        numberOfLines={3}
        style={s.input}
        value={description}
        onChangeText={setDescription}
      />
      <ThemedTextInput
        placeholder="Total amount (RM)"
        keyboardType="numeric"
        style={s.input}
        value={amount}
        onChangeText={setAmount}
      />

      <ThemedButton
        style={s.saveButton}
        onPress={handleSaveExpense}
        disabled={saving}
      >
        <ThemedText style={s.saveButtonText}>
          {saving ? "Saving..." : "Save Expense"}
        </ThemedText>
      </ThemedButton>

      {scannedInfo ? (
        <ThemedText style={s.scanHint}>
          Scan complete. You can review or edit the values before saving.
        </ThemedText>
      ) : null}
    </View>
  );
}

function CoinModal() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const COIN_COUNT = 1;
  const coins = useRef(
    new Array(COIN_COUNT).fill(0).map(() => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      rotate: new Animated.Value(0),
      scale: new Animated.Value(1),
    })),
  ).current;
  const ellipsisDots = useRef(
    [0, 1, 2].map(() => new Animated.Value(0.35)),
  ).current;

  useEffect(() => {
    if (!visible) {
      ellipsisDots.forEach((d) => d.setValue(0.35));
      return undefined;
    }
    const loops = ellipsisDots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 120),
          Animated.timing(dot, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.35,
            duration: 220,
            useNativeDriver: true,
          }),
        ]),
      ),
    );
    loops.forEach((l) => l.start());
    return () => {
      loops.forEach((l) => l.stop());
      ellipsisDots.forEach((d) => d.setValue(0.35));
    };
  }, [ellipsisDots, visible]);

  const show = () => {
    setVisible(true);
    coins.forEach((c) => {
      c.translateY.setValue(0);
      c.translateX.setValue(0);
      c.rotate.setValue(0);
      c.scale.setValue(1);
    });
    const allAnim = coins.map((c, i) => {
      const toRight = 80 + i * 28;
      return Animated.sequence([
        Animated.timing(c.translateY, {
          toValue: -110 - i * 6,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(c.translateY, {
            toValue: 200,
            duration: 1050,
            useNativeDriver: true,
          }),
          Animated.timing(c.translateX, {
            toValue: toRight,
            duration: 1050,
            useNativeDriver: true,
          }),
          Animated.timing(c.rotate, {
            toValue: 1440,
            duration: 1050,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(c.translateY, {
            toValue: 160,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.timing(c.translateY, {
            toValue: 200,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.timing(c.translateY, {
            toValue: 182,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(c.translateY, {
            toValue: 200,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(c.translateY, {
            toValue: 192,
            duration: 90,
            useNativeDriver: true,
          }),
          Animated.timing(c.translateY, {
            toValue: 200,
            duration: 90,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(c.scale, {
          toValue: 0.92,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(c.scale, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }),
      ]);
    });
    Animated.stagger(120, allAnim).start(() => {
      setVisible(false);
      router.replace("/expenses");
    });
  };
  global.__showExpenseCoinModal = show;

  const flipDegs = coins.map((c) =>
    c.rotate.interpolate({
      inputRange: [0, 1440],
      outputRange: ["0deg", "1440deg"],
    }),
  );
  const spinDegs = coins.map((c) =>
    c.rotate.interpolate({
      inputRange: [0, 1440],
      outputRange: ["0deg", "360deg"],
    }),
  );

  return (
    <Modal transparent={false} visible={visible} animationType="fade">
      <View style={[s.modalOverlay, { backgroundColor: T.bgWarm }]}>
        <View style={s.fullModalContent}>
          <View style={s.modalMessageRow}>
            <ThemedText style={s.modalTitle}>Saving your expense</ThemedText>
            <View style={s.modalDotsWrap}>
              {ellipsisDots.map((dot, i) => (
                <Animated.Text
                  key={i}
                  style={[
                    s.modalDot,
                    {
                      color: T.textDark,
                      opacity: dot,
                      transform: [
                        {
                          scale: dot.interpolate({
                            inputRange: [0.35, 1],
                            outputRange: [1, 1.55],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  .
                </Animated.Text>
              ))}
            </View>
          </View>
          <View style={s.boxWrap}>
            <Image
              source={require("../../../assets/img/money-box.png")}
              style={s.moneyBox}
              resizeMode="contain"
            />
            {coins.map((c, idx) => (
              <Animated.View
                key={idx}
                style={[
                  s.coin,
                  {
                    transform: [
                      { perspective: 900 },
                      { translateX: c.translateX },
                      { translateY: c.translateY },
                      { rotateX: flipDegs[idx] },
                      { rotateZ: spinDegs[idx] },
                      { scale: c.scale },
                    ],
                    opacity: 0.98,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default AddExpenses;

const s = StyleSheet.create({
  page: { flex: 1 },
  decoWrap: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 0 },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 32,
    alignItems: "stretch",
  },

  sectionCard: {
    width: "100%",
    padding: 20,
    borderRadius: 22,
    marginBottom: 18,
    backgroundColor: "#FFFDF7",
    borderWidth: 1.5,
    borderColor: "#F5DFA0",
    shadowColor: "rgba(200,168,0,0.1)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sectionHeaderText: { flex: 1 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C1810",
    marginBottom: 2,
  },
  sectionSubtitle: { fontSize: 13, color: "#BFA080" },

  switchLink: {
    alignSelf: "stretch",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#7F77DD",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "rgba(127,119,221,0.08)",
  },
  switchText: {
    fontWeight: "600",
    textAlign: "center",
    color: "#534AB7",
    fontSize: 13,
  },

  uploadArea: { marginBottom: 6 },
  uploadBox: {
    width: "100%",
    height: 250,
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: T.bgBorder,
    backgroundColor: T.bgWarm,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  uploadText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    color: T.textMid,
  },
  retakeRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
    gap: 6,
  },
  retakeText: {
    color: T.coral,
    fontSize: 12,
    fontWeight: "600",
  },
  secondaryButton: {
    width: "100%",
    borderRadius: 16,
    marginTop: 12,
    paddingVertical: 16,
    backgroundColor: T.accentPurpleLight,
    borderWidth: 1.5,
    borderColor: T.accentPurpleDeep,
  },
  secondaryButtonText: {
    color: T.accentPurpleDeep,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },

  input: {
    width: "100%",
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#F5DFA0",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFF8ED",
    color: "#2C1810",
    fontSize: 14,
  },
  saveButton: {
    width: "100%",
    borderRadius: 16,
    marginTop: 15,
    paddingVertical: 18,
    backgroundColor: "#534AB7",
    shadowColor: "#534AB7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  scanHint: {
    marginTop: 12,
    fontSize: 12,
    color: T.textLight,
    textAlign: "center",
  },

  modalOverlay: { flex: 1 },
  fullModalContent: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C1810",
    letterSpacing: 0.2,
  },
  modalMessageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 100,
  },
  modalDotsWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginLeft: 6,
  },
  modalDot: { fontSize: 30, fontWeight: "900", lineHeight: 30, marginLeft: 2 },
  boxWrap: {
    width: 300,
    height: 240,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  moneyBox: { width: 260, height: 200, position: "absolute", bottom: 0 },
  coin: {
    position: "absolute",
    top: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6B800",
    borderWidth: 3,
    borderColor: "#FFD54F",
    left: "50%",
    marginLeft: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});
