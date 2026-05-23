import { Stack } from "expo-router";
import PremiumHeader from "../../../components/ui/PremiumHeader";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => (
            <PremiumHeader
              title="My Profile"
              subtitle="Your account & settings"
              showBell
              showAction={false}
            />
          ),
        }}
      />
    </Stack>
  );
}