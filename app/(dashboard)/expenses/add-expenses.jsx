import React from "react";
import { StyleSheet, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ThemedView from "../../../components/ThemedView";
import ThemedScrollView from "../../../components/ThemedScrollView";
import ThemedCard from "../../../components/ThemedCard";
import ThemedText from "../../../components/ThemedText";
import Spacer from "../../../components/Spacer";
import ThemedTextInput from "../../../components/ThemedTextInput";
import ThemedButton from "../../../components/ThemedButton";
import ImageUpload from "../../../components/ThemedUploadImage";
import { useTheme } from "../../../hooks/useTheme";
import { getPrimaryColor } from "../../../constants/Colors";

function AddExpenses() {
  const { method } = useLocalSearchParams();
  const isUploadMode = method !== "manual";
  const { theme, colorScheme } = useTheme();
  const primaryColor = getPrimaryColor(colorScheme);

  return (
    <ThemedView
      safe
      style={[styles.page, { backgroundColor: theme.background }]}
    >
      <ThemedScrollView contentContainerStyle={styles.content}>
        {isUploadMode ? <UploadReceipt /> : <ManualEntry />}
      </ThemedScrollView>
    </ThemedView>
  );
}

const UploadReceipt = () => {
  const { theme, colorScheme } = useTheme();
  const primaryColor = getPrimaryColor(colorScheme);

  return (
    <ThemedCard
      style={[
        styles.sectionCard,
        {
          backgroundColor: theme.uiBackground,
          borderColor: theme.iconColor,
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View
          style={[styles.sectionIconWrap, { backgroundColor: primaryColor }]}
        >
          <Ionicons name="camera" size={18} color="#fff" />
        </View>
        <View style={styles.sectionHeaderText}>
          <ThemedText
            title
            style={[styles.sectionTitle, { color: theme.text }]}
          >
            Receipt Upload
          </ThemedText>
          <ThemedText
            style={[styles.sectionSubtitle, { color: theme.placeholderText }]}
          >
            Add a receipt and keep the details tidy.
          </ThemedText>
        </View>
      </View>
      <Link
        style={[
          styles.switchLink,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(184, 168, 216, 0.16)"
                : "rgba(104, 73, 167, 0.10)",
            borderColor: primaryColor,
          },
        ]}
        href={{
          pathname: "/expenses/add-expenses",
          params: { method: "manual" },
        }}
      >
        <ThemedText
          style={[
            styles.switchText,
            { color: colorScheme === "dark" ? theme.text : primaryColor },
          ]}
        >
          Don&apos;t have a receipt? Switch to manual entry
        </ThemedText>
      </Link>
      <Spacer height={30} />
      <ImageUpload purpose="receipt" />
      <ThemedTextInput
        placeholder="Expense description (optional)"
        multiline={true}
        numberOfLines={3}
        style={[
          styles.input,
          {
            backgroundColor: theme.background,
            borderColor: theme.iconColor,
            color: theme.text,
          },
        ]}
      />
      <ThemedButton
        style={[styles.saveButton, { backgroundColor: primaryColor }]}
      >
        <ThemedText style={styles.saveButtonText}>Save Expense</ThemedText>
      </ThemedButton>
    </ThemedCard>
  );
};

const ManualEntry = () => {
  const { theme, colorScheme } = useTheme();
  const primaryColor = getPrimaryColor(colorScheme);

  return (
    <ThemedCard
      style={[
        styles.sectionCard,
        {
          backgroundColor: theme.uiBackground,
          borderColor: theme.iconColor,
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View
          style={[styles.sectionIconWrap, { backgroundColor: primaryColor }]}
        >
          <Ionicons name="list" size={18} color="#fff" />
        </View>
        <View style={styles.sectionHeaderText}>
          <ThemedText
            title
            style={[styles.sectionTitle, { color: theme.text }]}
          >
            Expense Details
          </ThemedText>
          <ThemedText
            style={[styles.sectionSubtitle, { color: theme.placeholderText }]}
          >
            Enter the amount and description manually.
          </ThemedText>
        </View>
      </View>
      <Link
        style={[
          styles.switchLink,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(184, 168, 216, 0.16)"
                : "rgba(104, 73, 167, 0.10)",
            borderColor: primaryColor,
          },
        ]}
        href={{
          pathname: "/expenses/add-expenses",
          params: { method: "upload" },
        }}
      >
        <ThemedText
          style={[
            styles.switchText,
            { color: colorScheme === "dark" ? theme.text : primaryColor },
          ]}
        >
          Prefer a scan? Try our receipt upload!
        </ThemedText>
      </Link>
      <Spacer height={50} />
      <ThemedTextInput
        placeholder="Expense description"
        multiline={true}
        numberOfLines={3}
        style={[
          styles.input,
          {
            backgroundColor: theme.background,
            borderColor: theme.iconColor,
            color: theme.text,
          },
        ]}
      />
      <ThemedTextInput
        placeholder="Total amount (RM)"
        keyboardType="numeric"
        style={[
          styles.input,
          {
            backgroundColor: theme.background,
            borderColor: theme.iconColor,
            color: theme.text,
          },
        ]}
      />
      <ThemedButton
        style={[styles.saveButton, { backgroundColor: primaryColor }]}
      >
        <ThemedText style={styles.saveButtonText}>Save Expense</ThemedText>
      </ThemedButton>
    </ThemedCard>
  );
};

export default AddExpenses;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
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
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 22,
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 2,
    opacity: 0.72,
  },
  switchLink: {
    alignSelf: "stretch",
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  switchText: {
    fontWeight: "600",
    textAlign: "center",
  },
  input: {
    width: "100%",
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  saveButton: {
    width: "100%",
    borderRadius: 16,
    marginTop: 15,
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
