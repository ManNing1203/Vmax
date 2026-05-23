import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PremiumHeader from "../../../components/ui/PremiumHeader";
import { TutorialProvider } from "./GoalTutorialOverlay";

export default function MyGoalLayout() {
  const router = useRouter();

  return (
    <TutorialProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            header: () => (
              <PremiumHeader
                title="My Goals"
                subtitle="Track & grow your savings"
                showBell
                showAction
                actionIcon="add"
                onActionPress={() => router.push("/(dashboard)/myGoal/add-mygoal")}
              />
            ),
          }}
        />
        <Stack.Screen
          name="add-mygoal"
          options={{
            headerTitle: "Add Goal",
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="close" size={26} color="#534AB7" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="goal-detail"
          options={{ headerTitle: "Goal Details" }}
        />
      </Stack>
    </TutorialProvider>
  );
}