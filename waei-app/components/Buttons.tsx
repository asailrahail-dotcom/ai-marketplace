import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useAppState } from '../lib/app-state';
import { ThemedText } from './Themed';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  full?: boolean;
}

export function PrimaryButton({ label, onPress, disabled, loading, full }: ButtonProps) {
  const { colors } = useAppState();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        full && styles.full,
        {
          backgroundColor: colors.primary,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <ThemedText weight="bold" size={16} color={colors.onPrimary} center>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, disabled, full }: ButtonProps) {
  const { colors } = useAppState();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        full && styles.full,
        {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary,
          opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
        },
      ]}
    >
      <ThemedText weight="medium" size={16} color={colors.primary} center>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function TextLink({ label, onPress }: { label: string; onPress: () => void }) {
  const { colors } = useAppState();
  return (
    <Pressable onPress={onPress} hitSlop={10}>
      <ThemedText weight="medium" size={14} color={colors.textMuted} center>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  full: {
    width: '100%',
  },
});
