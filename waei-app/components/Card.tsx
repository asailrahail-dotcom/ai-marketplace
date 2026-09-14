import React from 'react';
import { Pressable, StyleSheet, View, ViewProps } from 'react-native';
import { useAppState } from '../lib/app-state';

interface CardProps extends ViewProps {
  onPress?: () => void;
  elevated?: boolean;
}

export function Card({ style, onPress, elevated, children, ...rest }: CardProps) {
  const { colors, resolvedScheme } = useAppState();
  const content = (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowOpacity: resolvedScheme === 'dark' ? 0 : elevated ? 0.08 : 0.05,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 1,
  },
});
