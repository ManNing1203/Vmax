import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PremiumHeader from "../../../components/ui/PremiumHeader";

export default function GroupGoalLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <PremiumHeader
              title="Group Goals"
              subtitle="Save together, achieve more"
              showBell
              showAction
              actionIcon="add"
              onActionPress={() => router.push("/(dashboard)/groupGoal/create-group")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="create-group"
        options={{
          headerTitle: "Create Group Goal",
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={28} color="#534AB7" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="join-group"
        options={{
          headerTitle: "Join a Group",
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={28} color="#534AB7" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="group-detail"
        options={{ headerTitle: "Group Details" }}
      />
    </Stack>
  );
}