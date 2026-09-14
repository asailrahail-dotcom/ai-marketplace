import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { Screen, ThemedText } from '../components/Themed';
import { useAppState } from '../lib/app-state';

export default function SplashRoute() {
  const { ready, onboardingCompleted } = useAppState();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), 1300);
    return () => clearTimeout(timer);
  }, []);

  if (ready && minTimeElapsed) {
    return <Redirect href={onboardingCompleted ? '/(tabs)' : '/onboarding/welcome'} />;
  }

  return (
    <Screen style={{ alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <ThemedText size={46} weight="bold">
        وعي
      </ThemedText>
      <ThemedText size={15} muted center style={{ maxWidth: 260, lineHeight: 24 }}>
        لحظة وعي… قد تغيّر نظرتك لليوم.
      </ThemedText>
    </Screen>
  );
}
