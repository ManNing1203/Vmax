import React, { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import ThemedView from "../../../components/ThemedView";
import ThemedScrollView from "../../../components/ThemedScrollView";
import ThemedText from "../../../components/ThemedText";
import ThemedTextInput from "../../../components/ThemedTextInput";
import ThemedCard from "../../../components/ThemedCard";
import Spacer from "../../../components/Spacer";
import ThemedButton from "../../../components/ThemedButton";
import { useTheme } from "../../../hooks/useTheme";
import { getPrimaryColor } from "../../../constants/Colors";

function addMyGoal(props) {
  const { theme, colorScheme } = useTheme();
  const [date, setDate] = useState(null);
  const [show, setShow] = useState(false);
  const primaryColor = getPrimaryColor(colorScheme);

  const onChangeTargetDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return "";
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <ThemedView
      safe={true}
      style={[styles.page, { backgroundColor: theme.background }]}
    >
      <ThemedScrollView contentContainerStyle={styles.content}>
        <ThemedCard
          style={[
            styles.formCard,
            {
              backgroundColor: theme.uiBackground,
              borderColor: theme.iconColor,
              shadowColor: theme.iconColorFocused,
            },
          ]}
        >
          <View style={styles.headerContainer}>
            <ThemedText
              title={true}
              style={[styles.header, { color: theme.text }]}
            >
              Small steps lead to big changes
            </ThemedText>
            <ThemedText
              title={true}
              style={[
                styles.header,
                styles.headerAccent,
                { color: primaryColor },
              ]}
            >
              Start your journey here!
            </ThemedText>
          </View>
          <ThemedTextInput
            placeholder="Description for your goal"
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
            placeholder="Target amount"
            style={[
              styles.input,
              {
                backgroundColor: theme.background,
                borderColor: theme.iconColor,
                color: theme.text,
              },
            ]}
            keyboardType="numeric"
          />

          <Pressable
            onPress={() => setShow(true)}
            style={[
              styles.input,
              styles.dateField,
              {
                backgroundColor: theme.background,
                borderColor: show ? primaryColor : theme.iconColor,
              },
            ]}
          >
            {date ? (
              <ThemedText style={{ color: theme.text }}>
                {formatDate(date)}
              </ThemedText>
            ) : (
              <ThemedText
                style={[styles.placeholder, { color: theme.placeholderText }]}
              >
                Target Date
              </ThemedText>
            )}
          </Pressable>

          {show && (
            <DateTimePicker
              value={date || new Date()}
              mode="date"
              display="default"
              onChange={onChangeTargetDate}
            />
          )}

          <ThemedText style={[styles.note, { color: theme.text }]}>
            Our analysis suggests you will get there by 20 May 2026
          </ThemedText>

          <Spacer height={18} />
          <ThemedButton
            style={[
              styles.primaryButton,
              {
                backgroundColor: primaryColor,
                shadowColor: primaryColor,
              },
            ]}
          >
            <ThemedText title style={styles.primaryButtonText}>
              Start Journey
            </ThemedText>
          </ThemedButton>
        </ThemedCard>
      </ThemedScrollView>
    </ThemedView>
  );
}

export default addMyGoal;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 36,
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 17,
    marginBottom: 4,
    textAlign: "center",
    lineHeight: 24,
  },
  headerAccent: {
    fontSize: 21,
    letterSpacing: 0.3,
  },
  formCard: {
    borderRadius: 24,
    padding: 20,
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  input: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderWidth: 1,
    marginBottom: 0,
    width: "100%",
    minHeight: 56,
  },
  dateField: {
    justifyContent: "center",
    paddingVertical: 0,
  },
  placeholder: {
    fontSize: 15,
  },
  note: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 15,
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 12,
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    letterSpacing: 0.35,
  },
});
