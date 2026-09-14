import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Screen, ThemedText } from '../../components/Themed';
import { ModalHeader } from '../../components/ModalHeader';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/Buttons';
import { useAppState } from '../../lib/app-state';
import { todayBlessing, isoDate } from '../../lib/content';
import { getJSON, setJSON, StorageKeys } from '../../lib/storage';

interface GratitudeEntry {
  date: string;
  blessingId: string;
}

export default function BlessingScreen() {
  const { colors } = useAppState();
  const blessing = todayBlessing();
  const today = isoDate();
  const [loggedToday, setLoggedToday] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await getJSON<GratitudeEntry[]>(StorageKeys.gratitudeLog, []);
      setLoggedToday(list.some((e) => e.date === today));
    })();
  }, [today]);

  const logGratitude = async () => {
    const list = await getJSON<GratitudeEntry[]>(StorageKeys.gratitudeLog, []);
    if (list.some((e) => e.date === today)) return;
    await setJSON(StorageKeys.gratitudeLog, [...list, { date: today, blessingId: blessing.id }]);
    setLoggedToday(true);
  };

  return (
    <Screen>
      <ModalHeader title="نعمة اليوم" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={{ backgroundColor: colors.primarySoft, borderColor: colors.primary, marginBottom: 18 }}>
          <ThemedText size={17} weight="medium" style={{ lineHeight: 28 }}>
            {blessing.text}
          </ThemedText>
        </Card>

        <Card style={{ marginBottom: 24 }}>
          <ThemedText size={13} weight="medium" muted style={{ marginBottom: 8 }}>
            سؤال للتأمل
          </ThemedText>
          <ThemedText size={15} style={{ lineHeight: 24 }}>
            {blessing.question}
          </ThemedText>
        </Card>

        <PrimaryButton
          label={loggedToday ? 'سُجّلت في سجل النعم ✓' : 'الحمد لله'}
          full
          disabled={loggedToday}
          onPress={logGratitude}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
});
