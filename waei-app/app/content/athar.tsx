import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Screen, ThemedText } from '../../components/Themed';
import { ModalHeader } from '../../components/ModalHeader';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/Buttons';
import { useAppState } from '../../lib/app-state';
import { todayAthar, isoDate } from '../../lib/content';
import { getJSON, setJSON, StorageKeys } from '../../lib/storage';

export default function AtharScreen() {
  const { colors } = useAppState();
  const athar = todayAthar();
  const today = isoDate();
  const [done, setDone] = useState(false);

  useEffect(() => {
    (async () => {
      const map = await getJSON<Record<string, boolean>>(StorageKeys.athrDone, {});
      setDone(!!map[today]);
    })();
  }, [today]);

  const complete = async () => {
    const map = await getJSON<Record<string, boolean>>(StorageKeys.athrDone, {});
    await setJSON(StorageKeys.athrDone, { ...map, [today]: true });
    setDone(true);
  };

  return (
    <Screen>
      <ModalHeader title="أثر اليوم" />
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText size={13} muted style={{ marginBottom: 12, lineHeight: 20 }}>
          فكرة بسيطة، لا واجب ولا التزام — افعلها إن ناسبتك اليوم.
        </ThemedText>
        <Card style={{ backgroundColor: colors.primarySoft, borderColor: colors.primary, marginBottom: 24 }}>
          <ThemedText size={17} weight="medium" style={{ lineHeight: 28 }}>
            {athar.text}
          </ThemedText>
        </Card>

        <PrimaryButton
          label={done ? 'أنجزت الأثر ✓' : 'أنجزت الأثر'}
          full
          disabled={done}
          onPress={complete}
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
