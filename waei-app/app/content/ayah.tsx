import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, ThemedText } from '../../components/Themed';
import { ModalHeader } from '../../components/ModalHeader';
import { Card } from '../../components/Card';
import { PrimaryButton, SecondaryButton } from '../../components/Buttons';
import { useAppState } from '../../lib/app-state';
import { todayAyah } from '../../lib/content';
import { getJSON, setJSON, StorageKeys } from '../../lib/storage';

export default function AyahScreen() {
  const { colors } = useAppState();
  const ayah = todayAyah();
  const [saved, setSaved] = useState(false);
  const [reflecting, setReflecting] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await getJSON<string[]>(StorageKeys.savedAyat, []);
      setSaved(list.includes(ayah.id));
    })();
  }, [ayah.id]);

  const toggleSave = async () => {
    const list = await getJSON<string[]>(StorageKeys.savedAyat, []);
    const next = saved ? list.filter((id) => id !== ayah.id) : [...list, ayah.id];
    await setJSON(StorageKeys.savedAyat, next);
    setSaved(!saved);
  };

  return (
    <Screen>
      <ModalHeader title="آية اليوم" />
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText size={13} muted style={{ marginBottom: 10 }}>
          {ayah.surah} • {ayah.ayahRef}
        </ThemedText>

        <Card style={{ backgroundColor: colors.primarySoft, borderColor: colors.primary, marginBottom: 18 }}>
          <ThemedText size={20} weight="bold" style={{ lineHeight: 36 }}>
            {ayah.text}
          </ThemedText>
        </Card>

        {reflecting ? (
          <Card style={{ marginBottom: 18 }}>
            <ThemedText size={13} weight="medium" muted style={{ marginBottom: 8 }}>
              خاطرة تأملية
            </ThemedText>
            <ThemedText size={15} style={{ lineHeight: 24 }}>
              {ayah.reflection}
            </ThemedText>
          </Card>
        ) : null}

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <SecondaryButton
              label={reflecting ? 'إخفاء التدبر' : 'تدبر'}
              full
              onPress={() => setReflecting((v) => !v)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              label={saved ? 'محفوظة ✓' : 'حفظ الآية'}
              full
              onPress={toggleSave}
            />
          </View>
        </View>

        <View style={styles.noteRow}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
          <ThemedText size={12} muted style={{ flex: 1, lineHeight: 18 }}>
            نسخة تجريبية بمجموعة آيات قصيرة موثقة، بانتظار ربطها بمصدر قرآني موثوق لاحقًا.
          </ThemedText>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  noteRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
});
