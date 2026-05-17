import React, { useState, useMemo } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  SectionList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemedText from "../../../components/ThemedText";
import ThemedView from "../../../components/ThemedView";
import ThemedCard from "../../../components/ThemedCard";
import ThemedModal from "../../../components/ThemedModal";
import { useTheme } from "../../../hooks/useTheme";
import { getPrimaryColor } from "../../../constants/Colors";

const ExpensesIndex = () => {
  const { theme, colorScheme } = useTheme();
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showMonthFilter, setShowMonthFilter] = useState(false);

  const primaryColor = getPrimaryColor(colorScheme);

  // Mock data for demonstration purposes
  const expenses = [
    {
      id: "1", // Example of Expense with manual entry
      description: "Lunch with client",
      receipt_uri: "",
      amount: 45.0,
      created_at: "2026-05-01",
    },
    {
      id: "2", // Example of Receipt Upload with description
      description: "FKOM shopping",
      receipt_uri:
        "https://instagram.fkul19-1.fna.fbcdn.net/v/t51.82787-19/648308314_18040284602566350_384478460884245737_n.jpg?stp=dst-jpg_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=instagram.fkul19-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2gEIUFryfBbQl4zO_nC-XpTH_uHaZBrdQmfZjfYqKvkSO5tXKO5egVYD6ws2EJr4Wq0&_nc_ohc=GIY90nGBWO8Q7kNvwGWQh54&_nc_gid=3BHDyV_ziA6QqfKhBqaQoA&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_Af4nb3Zjp7VlS3-9pv10Y5Wp4WMTjAAaVctbeqaEPkGhlQ&oe=6A0E9FAF&_nc_sid=8b3546",
      amount: 30.5,
      created_at: "2026-05-03",
    },
    {
      id: "3", // Example of Receipt Upload with no expenses description
      description: "",
      receipt_uri:
        "https://news.umpsa.edu.my/sites/default/files/gallery/UMPSA%20.jpg",
      amount: 15.75,
      created_at: "2026-05-03",
    },
    {
      id: "4",
      description: "Conference registration",
      receipt_uri: "",
      amount: 120.0,
      created_at: "2026-05-03",
    },
    {
      id: "5",
      description: "Travel expenses",
      receipt_uri: "",
      amount: 200.0,
      created_at: "2026-05-10",
    },
    {
      id: "6",
      description: "Team dinner",
      receipt_uri: "",
      amount: 80.0,
      created_at: "2026-04-12",
    },
    {
      id: "7",
      description: "Software subscription",
      receipt_uri: "",
      amount: 50.0,
      created_at: "2026-03-12",
    },
    {
      id: "8",
      description: "Client entertainment",
      receipt_uri: "",
      amount: 150.0,
      created_at: "2026-04-12",
    },
    {
      id: "9",
      description: "Office rent",
      receipt_uri: "",
      amount: 1000.0,
      created_at: "2026-04-19",
    },
    {
      id: "10",
      description: "Utilities",
      receipt_uri: "",
      amount: 300.0,
      created_at: "2026-05-25",
    },
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getMonthFromDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  const sections = useMemo(() => {
    const sorted = expenses.slice().sort((left, right) => {
      const leftDate = new Date(left.created_at);
      const rightDate = new Date(right.created_at);
      return sortOrder === "desc" ? rightDate - leftDate : leftDate - rightDate;
    });

    const filtered = selectedMonth
      ? sorted.filter((expense) => {
          return getMonthFromDate(expense.created_at) === selectedMonth;
        })
      : sorted;

    return filtered.reduce((grouped, expense) => {
      const formattedDate = formatDate(expense.created_at);
      const section = grouped.find((entry) => entry.title === formattedDate);

      if (section) {
        section.data.push(expense);
      } else {
        grouped.push({ title: formattedDate, data: [expense] });
      }

      return grouped;
    }, []);
  }, [expenses, sortOrder, selectedMonth]);

  const uniqueMonths = useMemo(() => {
    return [
      ...new Set(expenses.map((e) => getMonthFromDate(e.created_at))),
    ].sort((a, b) => new Date(`01 ${b}`) - new Date(`01 ${a}`));
  }, [expenses]);

  const totalByDate = useMemo(() => {
    return sections.reduce((acc, section) => {
      const sum = section.data.reduce((s, item) => s + item.amount, 0);
      acc[section.title] = sum;
      return acc;
    }, {});
  }, [sections]);

  const getCategoryInfo = (description) => {
    const desc = description.toLowerCase().trim();

    if (
      desc.includes("food") ||
      desc.includes("lunch") ||
      desc.includes("dinner") ||
      desc.includes("breakfast") ||
      desc.includes("eat") ||
      desc.includes("restaurant") ||
      desc.includes("cafe") ||
      desc.includes("meal")
    ) {
      return { emoji: "🍽️", color: "#FF6B6B" };
    }

    if (
      desc.includes("travel") ||
      desc.includes("transport") ||
      desc.includes("taxi") ||
      desc.includes("flight") ||
      desc.includes("hotel") ||
      desc.includes("uber") ||
      desc.includes("car")
    ) {
      return { emoji: "✈️", color: "#4ECDC4" };
    }

    if (
      desc.includes("office") ||
      desc.includes("supply") ||
      desc.includes("software") ||
      desc.includes("work") ||
      desc.includes("tool") ||
      desc.includes("equipment")
    ) {
      return { emoji: "💼", color: "#45B7D1" };
    }

    if (
      desc.includes("conference") ||
      desc.includes("meeting") ||
      desc.includes("training") ||
      desc.includes("workshop") ||
      desc.includes("seminar")
    ) {
      return { emoji: "🎯", color: "#96CEB4" };
    }

    if (
      desc.includes("entertainment") ||
      desc.includes("movie") ||
      desc.includes("game") ||
      desc.includes("event") ||
      desc.includes("ticket")
    ) {
      return { emoji: "🎲", color: "#FFEAA7" };
    }

    if (
      desc.includes("rent") ||
      desc.includes("mortgage") ||
      desc.includes("property") ||
      desc.includes("house") ||
      desc.includes("apartment")
    ) {
      return { emoji: "🏠", color: "#DDA0DD" };
    }

    if (
      desc.includes("utilities") ||
      desc.includes("electric") ||
      desc.includes("water") ||
      desc.includes("internet") ||
      desc.includes("phone") ||
      desc.includes("subscription")
    ) {
      return { emoji: "⚡", color: "#c2b5af" };
    }

    if (
      desc.includes("shopping") ||
      desc.includes("shop") ||
      desc.includes("buy") ||
      desc.includes("purchase") ||
      desc.includes("clothes") ||
      desc.includes("store")
    ) {
      return { emoji: "🛍️", color: "#FF69B4" };
    }

    if (
      desc.includes("health") ||
      desc.includes("medical") ||
      desc.includes("doctor") ||
      desc.includes("pharmacy") ||
      desc.includes("medicine") ||
      desc.includes("hospital")
    ) {
      return { emoji: "💊", color: "#FF8C00" };
    }

    return { emoji: "💸", color: primaryColor };
  };

  return (
    <ThemedView style={{ flex: 1, paddingHorizontal: 12, paddingTop: 10 }}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            {
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(184, 168, 216, 0.2)"
                  : "rgba(104, 73, 167, 0.1)",
              borderColor: primaryColor,
            },
          ]}
          onPress={() => setShowMonthFilter(!showMonthFilter)}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="options" size={18} color={primaryColor} />
            <ThemedText
              style={[
                styles.controlButtonText,
                { color: primaryColor, marginLeft: 8 },
              ]}
            >
              {selectedMonth ? selectedMonth : "All"}
            </ThemedText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.controlButton,
            {
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(184, 168, 216, 0.2)"
                  : "rgba(104, 73, 167, 0.1)",
              borderColor: primaryColor,
            },
          ]}
          onPress={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name={"swap-vertical"} size={18} color={primaryColor} />
            <ThemedText
              style={[
                styles.controlButtonText,
                { color: primaryColor, marginLeft: 8 },
              ]}
            >
              {sortOrder === "desc" ? "Newest" : "Oldest"}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      {showMonthFilter && (
        <View
          style={[
            styles.filterDropdown,
            {
              backgroundColor: theme.uiBackground,
              borderColor: primaryColor,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setSelectedMonth(null);
              setShowMonthFilter(false);
            }}
          >
            <ThemedText style={styles.filterOption}>All</ThemedText>
          </TouchableOpacity>
          {uniqueMonths.map((month) => (
            <TouchableOpacity
              key={month}
              onPress={() => {
                setSelectedMonth(month);
                setShowMonthFilter(false);
              }}
              style={
                selectedMonth === month ? styles.filterOptionSelected : null
              }
            >
              <ThemedText
                style={[
                  styles.filterOption,
                  selectedMonth === month && {
                    color: primaryColor,
                    fontWeight: "700",
                  },
                ]}
              >
                {month}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeaderWrapper}>
            <ThemedView style={styles.dateHeader}>
              <View style={styles.dateHeaderContent}>
                <ThemedText
                  style={[
                    styles.dateText,
                    {
                      color: primaryColor,
                    },
                  ]}
                >
                  {section.title}
                </ThemedText>
                <ThemedText
                  style={[styles.dateSummary, { color: primaryColor }]}
                >
                  RM {totalByDate[section.title]?.toFixed(2) || "0.00"}
                </ThemedText>
              </View>
              <View
                style={[
                  styles.dateUnderline,
                  { backgroundColor: primaryColor },
                ]}
              />
            </ThemedView>
          </View>
        )}
        renderItem={({ item }) => {
          const { emoji, color } = getCategoryInfo(item.description);
          return (
            <ThemedCard style={styles.expenseCard}>
              <View style={styles.expenseContent}>
                <View
                  style={[styles.categoryBadge, { backgroundColor: color }]}
                >
                  <ThemedText style={styles.categoryEmoji}>{emoji}</ThemedText>
                </View>

                <View style={styles.expenseDetails}>
                  <ThemedText
                    style={[
                      styles.expenseDescription,
                      {
                        color:
                          !item.description.trim() && item.receipt_uri
                            ? theme.placeholderText
                            : theme.text,
                      },
                    ]}
                  >
                    {item.description.trim() || "Receipt uploaded"}
                  </ThemedText>

                  {item.receipt_uri && (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedReceipt(item.receipt_uri);
                        setSelectedExpense(item);
                      }}
                      style={[
                        styles.receiptButton,
                        { backgroundColor: primaryColor },
                      ]}
                    >
                      <ThemedText style={styles.receiptButtonText}>
                        📄 View Receipt
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.amountContainer}>
                  <ThemedText
                    title
                    style={[styles.amount, { color: theme.text }]}
                  >
                    RM {item.amount.toFixed(2)}
                  </ThemedText>
                </View>
              </View>
            </ThemedCard>
          );
        }}
      />

      <ThemedModal
        visible={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        fullScreen
        contentStyle={[
          styles.modalContent,
          { backgroundColor: theme.background },
        ]}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setSelectedReceipt(null)}
        >
          <View style={styles.modalImageContainer}>
            {selectedExpense && (
              <ThemedText style={styles.receiptDate}>
                {selectedExpense.created_at}
              </ThemedText>
            )}
            {selectedReceipt ? (
              <Image
                source={{ uri: selectedReceipt }}
                style={styles.receiptImage}
                resizeMode="contain"
              />
            ) : null}
          </View>
        </TouchableOpacity>
      </ThemedModal>
    </ThemedView>
  );
};

export default ExpensesIndex;

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    gap: 12,
    // marginBottom: 5,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
  },
  controlButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
  filterDropdown: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    paddingVertical: 8,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  filterOptionSelected: {
    backgroundColor: "rgba(104, 73, 167, 0.1)",
  },

  listContent: {
    paddingBottom: 20,
  },

  sectionHeaderWrapper: {
    marginTop: 20,
  },
  dateHeader: {
    paddingBottom: 5,
  },
  dateHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dateSummary: {
    fontSize: 14,
    fontWeight: "600",
  },
  dateUnderline: {
    height: 1,
    borderRadius: 1.5,
    opacity: 0.4,
  },

  expenseCard: {
    marginBottom: 10,
    marginHorizontal: 0,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  expenseContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  categoryBadge: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  expenseDetails: {
    flex: 1,
    gap: 6,
  },
  expenseDescription: {
    fontSize: 14,
    fontWeight: "500",
  },
  receiptButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  receiptButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  amountContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
    paddingLeft: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: "700",
  },

  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalImageContainer: {
    width: "100%",
    height: "80%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: 16,
  },
  receiptDate: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  receiptImage: {
    width: "100%",
    height: "90%",
    borderRadius: 18,
  },
});
