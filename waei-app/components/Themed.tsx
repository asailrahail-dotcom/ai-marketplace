import React from 'react';
import { Text, TextProps, View, ViewProps } from 'react-native';
import { useAppState } from '../lib/app-state';
import { fontFamilies } from '../lib/theme';

type Weight = 'regular' | 'medium' | 'bold';

export interface ThemedTextProps extends TextProps {
  size?: number;
  weight?: Weight;
  color?: string;
  muted?: boolean;
  center?: boolean;
}

export function ThemedText({
  style,
  size = 16,
  weight = 'regular',
  color,
  muted,
  center,
  ...rest
}: ThemedTextProps) {
  const { colors, fontScale } = useAppState();
  return (
    <Text
      style={[
        {
          fontFamily: fontFamilies[weight],
          fontSize: Math.round(size * fontScale),
          color: color ?? (muted ? colors.textMuted : colors.text),
          textAlign: center ? 'center' : 'right',
          writingDirection: 'rtl',
        },
        style,
      ]}
      {...rest}
    />
  );
}

export function ThemedView({ style, ...rest }: ViewProps) {
  const { colors } = useAppState();
  return <View style={[{ backgroundColor: colors.background }, style]} {...rest} />;
}

export function Screen({ style, ...rest }: ViewProps) {
  const { colors } = useAppState();
  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }, style]} {...rest} />
  );
}
