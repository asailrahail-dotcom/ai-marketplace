import React from 'react';
import { Stack } from 'expo-router';
import { useAppState } from '../../lib/app-state';

export default function OnboardingLayout() {
  const { colors } = useAppState();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="goal" />
      <Stack.Screen name="reminder" />
    </Stack>
  );
}
