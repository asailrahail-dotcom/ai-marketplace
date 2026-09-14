import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Screen, ThemedText } from '../../components/Themed';
import { ModalHeader } from '../../components/ModalHeader';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/Buttons';
import { useAppState } from '../../lib/app-state';
import { todayMoment, isoDate } from '../../lib/content';
import { getJSON, setJSON, StorageKeys } from '../../lib/storage';

export default function MomentScreen() {
  const { colors } = useAppState();
  const moment = todayMoment();
  const today = isoDate();
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      const map = await getJSON<Record<string, boolean>>(StorageKeys.momentDone, {});
      setDone(!!map[today]);
    })();
  }, [today]);

  const finish = async () => {
    const map = await getJSON<Record<string, boolean>>(StorageKeys.momentDone, {});
    await setJSON(StorageKeys.momentDone, { ...map, [today]: true });
    setDone(true);
    setTimeout(() => router.back(), 500);
  };

  return (
    <Screen>
      <ModalHeader title="لحظة مع الله" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={{ marginBottom: 16 }}>
          <ThemedText size={16} style={{ lineHeight: 26 }}>
            {moment.lead}
          </ThemedText>
        </Card>

        <Card style={{ backgroundColor: colors.primarySoft, borderColor: colors.primary, marginBottom: 16 }}>
          <ThemedText size={16} weight="medium" center style={{ lineHeight: 28 }}>
            {moment.breathText}
          </ThemedText>
        </Card>

        <Card style={{ marginBottom: 28 }}>
          <ThemedText size={15} muted style={{ lineHeight: 24 }}>
            {moment.question}
          </ThemedText>
        </Card>

        <PrimaryButton label={done ? 'تمت ✓' : 'أنهيت اللحظة'} full onPress={finish} disabled={done} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
});
