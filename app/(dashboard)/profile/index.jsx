import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import ThemedCard from "../../../components/ThemedCard";
import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import ThemedButton from "../../../components/ThemedButton";
import ThemedTextInput from "../../../components/ThemedTextInput";
import ThemedModal from "../../../components/ThemedModal";
import ThemedFlatList from "../../../components/ThemedFlatList";
import Spacer from "../../../components/Spacer";
import ProfileIcon from "../../../assets/img/profile_icon.png";
import { Colors } from "../../../constants/Colors";
import { getPrimaryColor } from "../../../constants/Colors";
import { useUser } from "../../../hooks/useUser";
import { useTheme } from "../../../hooks/useTheme";

const ProfileIndex = () => {
  const { theme, colorScheme, themeMode, setThemeMode } = useTheme();
  const { user, logout } = useUser();
  const primaryColor = getPrimaryColor(colorScheme);

  // State
  const [activeModal, setActiveModal] = useState(null);
  const [savedUsername, setSavedUsername] = useState(user?.name || "");
  const [draftUsername, setDraftUsername] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "No email registered");
  const [savedSalary, setSavedSalary] = useState(
    user?.salary?.toString() || "0",
  );
  const [draftSalary, setDraftSalary] = useState(
    user?.salary?.toString() || "0",
  );
  const [savedProfileImage, setSavedProfileImage] = useState(
    user?.profileImageUri || null,
  );
  const [draftProfileImage, setDraftProfileImage] = useState(
    user?.profileImageUri || null,
  );

  const isDarkMode =
    (themeMode === "system" ? colorScheme : themeMode) === "dark";

  // Mock data for daily savings (daily income - expenses)
  const dailySavingsData = [
    { date: "15 May 2026", amount: "RM45.50" },
    { date: "14 May 2026", amount: "RM32.75" },
    { date: "13 May 2026", amount: "RM58.20" },
    { date: "12 May 2026", amount: "RM41.90" },
    { date: "11 May 2026", amount: "RM67.00" },
    { date: "10 May 2026", amount: "RM38.45" },
    { date: "09 May 2026", amount: "RM52.30" },
    { date: "01 May 2026", amount: "RM45.50" },
    { date: "04 May 2026", amount: "RM32.75" },
    { date: "03 May 2026", amount: "RM58.20" },
    { date: "02 May 2026", amount: "RM41.90" },
    { date: "08 May 2026", amount: "RM67.00" },
    { date: "01 May 2026", amount: "RM38.45" },
    { date: "05 May 2026", amount: "RM52.30" },
  ];

  // Handle image upload
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need gallery access to pick a photo.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setDraftProfileImage(result.assets[0].uri);
    }
  };

  // Save handlers
  const handleSaveAccount = () => {
    if (!draftUsername.trim()) {
      Alert.alert("Validation", "Username cannot be empty");
      return;
    }
    setSavedUsername(draftUsername.trim());
    setSavedProfileImage(draftProfileImage);
    Alert.alert("Success", "Account updated successfully");
    setActiveModal(null);
  };

  const handleSaveSalary = () => {
    if (!draftSalary.trim()) {
      Alert.alert("Validation", "Salary cannot be empty");
      return;
    }
    if (isNaN(parseFloat(draftSalary))) {
      Alert.alert("Validation", "Salary must be a valid number");
      return;
    }
    setSavedSalary(draftSalary.trim());
    Alert.alert("Success", "Salary updated successfully");
    setActiveModal(null);
  };

  const handleThemeSave = (mode) => {
    setThemeMode(mode);
    setActiveModal(null);
  };

  return (
    <ThemedView safe style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <View style={styles.avatar}>
            {savedProfileImage ? (
              <Image
                source={{ uri: savedProfileImage }}
                style={styles.avatarImage}
              />
            ) : (
              <Image source={ProfileIcon} style={styles.avatarImage} />
            )}
          </View>
          <View style={styles.profileText}>
            <ThemedText title style={styles.name}>
              {savedUsername}
            </ThemedText>
            <ThemedText style={[styles.email, { color: theme.iconColor }]}>
              {email}
            </ThemedText>
          </View>
        </View>

        <Spacer height={10} />
        <ThemedCard style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setDraftUsername(savedUsername);
              setDraftProfileImage(savedProfileImage);
              setActiveModal("account");
            }}
          >
            <Ionicons
              name="shield-checkmark"
              size={18}
              color={theme.iconColorFocused}
              style={styles.menuIcon}
            />
            <ThemedText style={styles.menuLabel}>Account</ThemedText>
            {savedUsername === "" && (
              <ThemedText
                style={[styles.setNowText, { color: Colors.warning }]}
              >
                Set Now
              </ThemedText>
            )}
            <Ionicons
              name="chevron-forward"
              color={theme.iconColorFocused}
              size={18}
            />
          </TouchableOpacity>
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.iconColor, opacity: 0.18 },
            ]}
          />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setDraftSalary(savedSalary);
              setActiveModal("salary");
            }}
          >
            <Ionicons
              name="logo-usd"
              size={18}
              color={theme.iconColorFocused}
              style={styles.menuIcon}
            />
            <ThemedText style={styles.menuLabel}>Current Salary</ThemedText>
            {savedSalary === "0" && (
              <ThemedText
                style={[styles.setNowText, { color: Colors.warning }]}
              >
                Set Now
              </ThemedText>
            )}
            <Ionicons
              name="chevron-forward"
              color={theme.iconColorFocused}
              size={18}
            />
          </TouchableOpacity>
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.iconColor, opacity: 0.18 },
            ]}
          />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setActiveModal("savings")}
          >
            <Ionicons
              name="wallet"
              size={18}
              color={theme.iconColorFocused}
              style={styles.menuIcon}
            />
            <ThemedText style={styles.menuLabel}>Daily Savings</ThemedText>
            <Ionicons
              name="chevron-forward"
              color={theme.iconColorFocused}
              size={18}
            />
          </TouchableOpacity>
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.iconColor, opacity: 0.18 },
            ]}
          />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setActiveModal("theme")}
          >
            <Ionicons
              name="contrast"
              size={18}
              color={theme.iconColorFocused}
              style={styles.menuIcon}
            />
            <ThemedText style={styles.menuLabel}>Theme Mode</ThemedText>
            <Ionicons
              name="chevron-forward"
              color={theme.iconColorFocused}
              size={18}
            />
          </TouchableOpacity>
          <View
            style={[
              styles.divider,
              { backgroundColor: theme.iconColor, opacity: 0.18 },
            ]}
          />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setActiveModal("logout")}
          >
            <Ionicons
              name="log-out"
              size={18}
              color={Colors.warning}
              style={styles.menuIcon}
            />
            <ThemedText style={[styles.menuLabel, { color: Colors.warning }]}>
              Logout
            </ThemedText>
            <Ionicons name="chevron-forward" color={Colors.warning} size={18} />
          </TouchableOpacity>
        </ThemedCard>
      </ScrollView>

      {/* Account Modal */}
      <ThemedModal
        visible={activeModal === "account"}
        onClose={() => setActiveModal(null)}
        fullScreen
        contentStyle={styles.modalContent}
        overlayStyle={styles.modalOverlay}
      >
        <View style={styles.modalCenter}>
          <View
            style={[
              styles.modalCardInner,
              { backgroundColor: theme.uiBackground },
            ]}
          >
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <ThemedText title style={styles.modalTitle}>
                Account
              </ThemedText>
              <Spacer height={40} />

              {/* Profile Image Section */}
              <View style={styles.imageSection}>
                <View style={styles.imageContainer}>
                  <View
                    style={[
                      styles.modalAvatar,
                      { backgroundColor: theme.navBackground },
                    ]}
                  >
                    {draftProfileImage ? (
                      <Image
                        source={{ uri: draftProfileImage }}
                        style={styles.modalAvatarImage}
                      />
                    ) : (
                      <Image
                        source={ProfileIcon}
                        style={styles.modalAvatarImage}
                      />
                    )}
                  </View>
                  <Pressable
                    style={[
                      styles.cameraIcon,
                      { backgroundColor: primaryColor },
                    ]}
                    onPress={handlePickImage}
                  >
                    <Ionicons name="camera" size={16} color="#fff" />
                  </Pressable>
                </View>
              </View>

              <ThemedText style={styles.label}>Username</ThemedText>
              <ThemedTextInput
                value={draftUsername}
                onChangeText={setDraftUsername}
                placeholder="Enter your username"
                style={styles.input}
              />

              <Spacer />
              <ThemedButton
                style={styles.saveButton}
                onPress={handleSaveAccount}
              >
                <ThemedText style={styles.saveButtonText}>
                  Save Changes
                </ThemedText>
              </ThemedButton>
            </ScrollView>
          </View>
        </View>
      </ThemedModal>

      {/* Salary Modal */}
      <ThemedModal
        visible={activeModal === "salary"}
        onClose={() => setActiveModal(null)}
        fullScreen
        contentStyle={styles.modalContent}
        overlayStyle={styles.modalOverlay}
      >
        <View style={styles.modalCenter}>
          <View
            style={[
              styles.modalCardInner,
              { backgroundColor: theme.uiBackground },
            ]}
          >
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <ThemedText title style={styles.modalTitle}>
                Current Salary
              </ThemedText>
              <Spacer height={40} />

              <ThemedText style={styles.label}>Monthly Salary</ThemedText>
              <View style={styles.salaryInputRow}>
                <View style={styles.salaryCurrencyWrap}>
                  <ThemedText style={styles.salaryCurrencyText}>RM</ThemedText>
                </View>
                <ThemedTextInput
                  value={draftSalary}
                  onChangeText={setDraftSalary}
                  placeholder="Enter salary amount"
                  keyboardType="decimal-pad"
                  style={styles.input}
                />
              </View>

              <Spacer />
              <ThemedButton
                style={styles.saveButton}
                onPress={handleSaveSalary}
              >
                <ThemedText style={styles.saveButtonText}>
                  Save Salary
                </ThemedText>
              </ThemedButton>
            </ScrollView>
          </View>
        </View>
      </ThemedModal>

      {/* Daily Savings Modal */}
      <ThemedModal
        visible={activeModal === "savings"}
        onClose={() => setActiveModal(null)}
        fullScreen
        contentStyle={styles.modalContent}
        overlayStyle={styles.modalOverlay}
      >
        <View style={styles.modalCenter}>
          <View
            style={[
              styles.modalCardInner,
              { backgroundColor: theme.uiBackground, flex: 1 },
            ]}
          >
            <ThemedFlatList
              data={dailySavingsData}
              keyExtractor={(_, index) => index.toString()}
              scrollEnabled={true}
              style={{ flex: 1 }}
              contentContainerStyle={styles.savingsFlatListContent}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.savingsItem,
                    {
                      borderBottomColor: theme.iconColor,
                      borderBottomWidth:
                        index === dailySavingsData.length - 1
                          ? 0
                          : StyleSheet.hairlineWidth,
                    },
                  ]}
                >
                  <View>
                    <ThemedText style={styles.savingsDate}>
                      {item.date}
                    </ThemedText>
                  </View>
                  <ThemedText
                    title={true}
                    style={[styles.savingsAmount, { color: primaryColor }]}
                  >
                    {item.amount}
                  </ThemedText>
                </View>
              )}
              ListHeaderComponent={
                <View style={styles.savingsHeader}>
                  <ThemedText title style={styles.modalTitle}>
                    Daily Savings
                  </ThemedText>
                  <Spacer height={20} />
                </View>
              }
              ListFooterComponent={<Spacer height={8} />}
            />
          </View>
        </View>
      </ThemedModal>

      {/* Theme Modal */}
      <ThemedModal
        visible={activeModal === "theme"}
        onClose={() => setActiveModal(null)}
        fullScreen
        contentStyle={styles.modalContent}
        overlayStyle={styles.modalOverlay}
      >
        <View style={styles.modalCenter}>
          <View
            style={[
              styles.modalCardInner,
              { backgroundColor: theme.uiBackground },
            ]}
          >
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <ThemedText title style={styles.modalTitle}>
                Theme Mode
              </ThemedText>
              <Spacer height={40} />

              <Pressable
                style={[
                  styles.themeOption,
                  isDarkMode && styles.themeOptionActive,
                  {
                    borderColor: isDarkMode ? primaryColor : theme.iconColor,
                  },
                ]}
                onPress={() => handleThemeSave("dark")}
              >
                <Ionicons
                  name="moon"
                  size={24}
                  color={isDarkMode ? primaryColor : theme.iconColor}
                />
                <ThemedText style={styles.themeOptionText}>
                  Dark Mode
                </ThemedText>
              </Pressable>

              <Spacer height={12} />

              <Pressable
                style={[
                  styles.themeOption,
                  !isDarkMode && styles.themeOptionActive,
                  {
                    borderColor: !isDarkMode ? primaryColor : theme.iconColor,
                  },
                ]}
                onPress={() => handleThemeSave("light")}
              >
                <Ionicons
                  name="sunny"
                  size={24}
                  color={!isDarkMode ? primaryColor : theme.iconColor}
                />
                <ThemedText style={styles.themeOptionText}>
                  Light Mode
                </ThemedText>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </ThemedModal>

      {/* Logout Confirmation Modal */}
      <ThemedModal
        visible={activeModal === "logout"}
        onClose={() => setActiveModal(null)}
        fullScreen
        contentStyle={styles.modalContent}
        overlayStyle={styles.modalOverlay}
      >
        <View style={styles.modalCenter}>
          <View
            style={[
              styles.modalCardInner,
              { backgroundColor: theme.uiBackground, maxHeight: 280 },
            ]}
          >
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <ThemedText style={styles.logoutMessage}>
                Are you sure you want to logout?
              </ThemedText>

              <Spacer height={40} />

              <ThemedButton
                style={[styles.saveButton, { backgroundColor: Colors.warning }]}
                onPress={() => {
                  logout();
                  setActiveModal(null);
                }}
              >
                <ThemedText style={styles.saveButtonText}>
                  Yes, Logout
                </ThemedText>
              </ThemedButton>

              <Pressable
                style={[styles.cancelButton, { borderColor: theme.iconColor }]}
                onPress={() => setActiveModal(null)}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </ThemedModal>
    </ThemedView>
  );
};

export default ProfileIndex;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 14,
  },
  menuCard: {
    paddingVertical: 8,
    paddingHorizontal: 0,
    borderRadius: 22,
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
    borderRadius: 22,
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    lineHeight: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
  },
  setNowText: {
    marginRight: 5,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
  },
  modalContent: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  modalCardInner: {
    width: "90%",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    maxHeight: 420,
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    flex: 1,
  },
  modalScrollContent: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  modalTitle: {
    fontSize: 20,
    lineHeight: 24,
    marginBottom: 4,
    textAlign: "center",
  },
  label: {
    fontSize: 13,
    opacity: 0.7,
  },
  salaryInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  salaryCurrencyWrap: {
    height: 60,
    justifyContent: "center",
  },
  salaryCurrencyText: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    height: 60,
    borderRadius: 12,
    paddingHorizontal: 14,
    width: "100%",
    flex: 1,
    marginBottom: 0,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 12,
  },
  imageContainer: {
    position: "relative",
    width: 100,
    height: 100,
  },
  modalAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: "hidden",
  },
  modalAvatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  saveButton: {
    width: "100%",
    marginVertical: 0,
    marginBottom: 12,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  savingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  savingsFlatListContent: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  savingsHeader: {
    paddingBottom: 4,
  },
  headerCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  savingsFooter: {
    paddingTop: 4,
  },
  savingsDate: {
    fontSize: 13,
    fontWeight: "500",
  },
  savingsAmount: {
    fontSize: 13,
    fontWeight: "600",
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 0,
  },
  closeButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
  },
  themeOptionActive: {
    borderWidth: 2.5,
  },
  themeOptionText: {
    fontSize: 15,
    fontWeight: "500",
  },
  logoutMessage: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    textAlign: "center",
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
