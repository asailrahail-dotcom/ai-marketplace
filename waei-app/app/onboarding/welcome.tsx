import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Screen, ThemedText } from '../../components/Themed';
import { PrimaryButton } from '../../components/Buttons';
import { ProgressDots } from '../../components/ProgressDots';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <Screen style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.center}>
        <ThemedText size={48} weight="bold" style={{ marginBottom: 16 }}>
          وعي
        </ThemedText>
        <ThemedText size={16} muted center style={{ maxWidth: 280, lineHeight: 26 }}>
          مساحة هادئة تساعدك أن تكون أكثر وعيًا بالله، وبالنعم من حولك، خلال لحظات قصيرة كل يوم.
        </ThemedText>
      </View>
      <View style={styles.footer}>
        <ProgressDots total={3} current={0} />
        <PrimaryButton label="ابدأ" full onPress={() => router.push('/onboarding/goal')} />
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
    gap: 20,
  },
});
