import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, ThemedText } from '../../components/Themed';
import { PrimaryButton } from '../../components/Buttons';
import { ProgressDots } from '../../components/ProgressDots';
import { useAppState } from '../../lib/app-state';
import { OnboardingGoal } from '../../lib/app-state';

const OPTIONS: { key: OnboardingGoal; label: string }[] = [
  { key: 'assurance', label: 'طمأنينة' },
  { key: 'gratitude', label: 'ملاحظة النعم' },
  { key: 'reflection', label: 'تدبر' },
  { key: 'closeness', label: 'تقرب' },
  { key: 'calm', label: 'هدوء' },
  { key: 'unsure', label: 'لا أعرف' },
];

export default function GoalScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppState();
  const [selected, setSelected] = useState<OnboardingGoal | null>(null);

  return (
    <Screen
      style={[
        styles.container,
        { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <View>
        <ThemedText size={22} weight="bold" style={{ marginBottom: 10 }}>
          ماذا تريد أن تمنحه لنفسك اليوم؟
        </ThemedText>
        <ThemedText size={14} muted style={{ marginBottom: 26 }}>
          اختر ما يشعرك الآن، يمكنك تغييره لاحقًا.
        </ThemedText>

        <View style={styles.grid}>
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setSelected(opt.key)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                <ThemedText
                  weight="medium"
                  color={isSelected ? colors.onPrimary : colors.text}
                  center
                >
                  {opt.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <ProgressDots total={3} current={1} />
        <PrimaryButton
          label="متابعة"
          full
          disabled={!selected}
          onPress={() =>
            router.push({ pathname: '/onboarding/reminder', params: { goal: selected! } })
          }
        />
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  footer: {
    gap: 20,
  },
});
