import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, ThemedText } from '../../components/Themed';
import { PrimaryButton, SecondaryButton } from '../../components/Buttons';
import { ProgressDots } from '../../components/ProgressDots';
import { useAppState, OnboardingGoal } from '../../lib/app-state';

export default function ReminderScreen() {
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useAppState();
  const { goal } = useLocalSearchParams<{ goal: OnboardingGoal }>();
  const [submitting, setSubmitting] = useState(false);

  const finish = async (wantsReminder: boolean) => {
    setSubmitting(true);
    await completeOnboarding(goal ?? 'unsure', wantsReminder);
    router.replace('/(tabs)');
  };

  return (
    <Screen
      style={[
        styles.container,
        { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View style={styles.center}>
        <ThemedText size={22} weight="bold" center style={{ marginBottom: 12 }}>
          هل تحب أن نذكّرك كل يوم؟
        </ThemedText>
        <ThemedText size={14} muted center style={{ maxWidth: 280, lineHeight: 24 }}>
          تذكير هادئ ولطيف فقط، بلا إلحاح. يمكنك تغيير هذا لاحقًا من الإعدادات في أي وقت.
        </ThemedText>
      </View>

      <View style={styles.footer}>
        <ProgressDots total={3} current={2} />
        <PrimaryButton label="نعم، ذكّرني" full loading={submitting} onPress={() => finish(true)} />
        <SecondaryButton label="ليس الآن" full disabled={submitting} onPress={() => finish(false)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    gap: 14,
  },
});
