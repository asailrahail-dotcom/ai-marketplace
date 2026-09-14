import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAppState } from '../lib/app-state';
import { ThemedText } from './Themed';

interface Option<T extends string> {
  value: T;
  label: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const { colors } = useAppState();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.surfaceAlt }]}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.segment, active && { backgroundColor: colors.primary }]}
          >
            <ThemedText
              size={13}
              weight="medium"
              center
              color={active ? colors.onPrimary : colors.text}
            >
              {opt.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
});
