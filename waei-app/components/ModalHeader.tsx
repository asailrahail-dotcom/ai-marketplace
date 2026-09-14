import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppState } from '../lib/app-state';
import { ThemedText } from './Themed';

export function ModalHeader({ title }: { title: string }) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppState();

  return (
    <View style={[styles.row, { paddingTop: insets.top + 14, borderBottomColor: colors.border }]}>
      <ThemedText size={17} weight="bold">
        {title}
      </ThemedText>
      <Pressable
        onPress={() => router.back()}
        hitSlop={10}
        style={[styles.close, { backgroundColor: colors.surfaceAlt }]}
      >
        <Ionicons name="close" size={18} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
