import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppState } from '../lib/app-state';

export function ProgressDots({ total, current }: { total: number; current: number }) {
  const { colors } = useAppState();
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i === current ? colors.primary : colors.border,
              width: i === current ? 22 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
