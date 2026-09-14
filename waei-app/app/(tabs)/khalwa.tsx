import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, ThemedText } from '../../components/Themed';
import { Card } from '../../components/Card';
import { PrimaryButton, SecondaryButton, TextLink } from '../../components/Buttons';
import { useAppState } from '../../lib/app-state';
import { fontFamilies } from '../../lib/theme';
import { FEELINGS, Feeling, isoDate, todayDua, todayQuestion } from '../../lib/content';
import { getJSON, setJSON, StorageKeys } from '../../lib/storage';

type Phase = 'select' | 'active' | 'end';

const DURATIONS = [1, 3, 5, 10];

interface KhalwaSession {
  date: string;
  durationMinutes: number;
  feeling: Feeling;
  note: string;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function KhalwaScreen() {
  const insets = useSafeAreaInsets();
  const { colors, fontScale } = useAppState();
  const [phase, setPhase] = useState<Phase>('select');
  const [duration, setDuration] = useState(3);
  const [remaining, setRemaining] = useState(0);
  const [note, setNote] = useState('');
  const [feeling, setFeeling] = useState<Feeling | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const dua = todayDua();
  const question = todayQuestion();

  useEffect(() => {
    if (phase !== 'active') return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setPhase('end');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  const start = () => {
    setRemaining(duration * 60);
    setNote('');
    setPhase('active');
  };

  const endEarly = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase('end');
  };

  const finish = async () => {
    if (!feeling) return;
    const sessions = await getJSON<KhalwaSession[]>(StorageKeys.khalwaSessions, []);
    await setJSON(StorageKeys.khalwaSessions, [
      ...sessions,
      { date: isoDate(), durationMinutes: duration, feeling, note },
    ]);
    setFeeling(null);
    setPhase('select');
  };

  if (phase === 'select') {
    return (
      <Screen>
        <ScrollView
          contentContainerStyle={[
            styles.centerContent,
            { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 },
          ]}
        >
          <ThemedText size={22} weight="bold" center style={{ marginBottom: 10 }}>
            الخلوة مع الله
          </ThemedText>
          <ThemedText size={14} muted center style={{ maxWidth: 280, lineHeight: 24, marginBottom: 32 }}>
            مساحة هادئة بينك وبين الله، بلا تشتيت وبلا ضجيج.
          </ThemedText>

          <ThemedText size={13} weight="medium" muted style={{ marginBottom: 12 }}>
            اختر مدة الخلوة
          </ThemedText>
          <View style={styles.durationRow}>
            {DURATIONS.map((d) => {
              const active = d === duration;
              return (
                <Pressable
                  key={d}
                  onPress={() => setDuration(d)}
                  style={[
                    styles.durationChip,
                    {
                      backgroundColor: active ? colors.primary : colors.surface,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <ThemedText weight="bold" color={active ? colors.onPrimary : colors.text}>
                    {d}
                  </ThemedText>
                  <ThemedText size={11} color={active ? colors.onPrimary : colors.textMuted}>
                    دقائق
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          <View style={{ height: 32 }} />
          <PrimaryButton label="ابدأ الخلوة" full onPress={start} />
        </ScrollView>
      </Screen>
    );
  }

  if (phase === 'active') {
    return (
      <Screen>
        <ScrollView
          contentContainerStyle={[
            styles.centerContent,
            { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 },
          ]}
        >
          <ThemedText size={44} weight="bold" style={{ marginBottom: 28 }}>
            {formatTime(remaining)}
          </ThemedText>

          <Card style={{ backgroundColor: colors.primarySoft, borderColor: colors.primary, width: '100%', marginBottom: 16 }}>
            <ThemedText size={11} muted style={{ marginBottom: 6 }}>
              {dua.surah} • {dua.ayahRef}
            </ThemedText>
            <ThemedText size={17} weight="medium" style={{ lineHeight: 28 }}>
              {dua.text}
            </ThemedText>
          </Card>

          <Card style={{ width: '100%', marginBottom: 16 }}>
            <ThemedText size={13} weight="medium" muted style={{ marginBottom: 8 }}>
              سؤال للتأمل
            </ThemedText>
            <ThemedText size={15} style={{ lineHeight: 24 }}>
              {question.text}
            </ThemedText>
          </Card>

          <View style={{ width: '100%', marginBottom: 16 }}>
            <ThemedText size={13} weight="medium" muted style={{ marginBottom: 8 }}>
              مساحة للكتابة (اختياري)
            </ThemedText>
            <TextInput
              value={note}
              onChangeText={setNote}
              multiline
              textAlign="right"
              placeholder="اكتب ما يخطر ببالك..."
              placeholderTextColor={colors.textMuted}
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  fontFamily: fontFamilies.regular,
                  fontSize: Math.round(14 * fontScale),
                },
              ]}
            />
          </View>

          <TextLink label="إنهاء الخلوة الآن" onPress={endEarly} />
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[
          styles.centerContent,
          { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 40 },
        ]}
      >
        <ThemedText size={20} weight="bold" center style={{ marginBottom: 24 }}>
          كيف تشعر الآن؟
        </ThemedText>

        <View style={styles.feelingsWrap}>
          {FEELINGS.map((f) => {
            const active = feeling === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFeeling(f)}
                style={[
                  styles.feelingChip,
                  {
                    backgroundColor: active ? colors.primary : colors.surface,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <ThemedText weight="medium" color={active ? colors.onPrimary : colors.text}>
                  {f}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 28 }} />
        <PrimaryButton label="تم" full disabled={!feeling} onPress={finish} />
        <View style={{ height: 12 }} />
        <SecondaryButton label="خلوة جديدة" full onPress={() => setPhase('select')} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  durationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  durationChip: {
    width: 64,
    height: 64,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    minHeight: 90,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    textAlignVertical: 'top',
    writingDirection: 'rtl',
  },
  feelingsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  feelingChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
});
