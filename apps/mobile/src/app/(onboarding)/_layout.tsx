import { Stack } from "expo-router";
import { OnboardingProvider } from "@/features/onboarding/hooks/use-onboarding";

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="goal" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="activity" />
        <Stack.Screen name="equipment" />
        <Stack.Screen name="schedule" />
        <Stack.Screen name="nutrition" />
        <Stack.Screen name="review" />
      </Stack>
    </OnboardingProvider>
  );
}
