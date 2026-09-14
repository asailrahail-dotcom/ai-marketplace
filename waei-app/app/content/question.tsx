import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Screen, ThemedText } from '../../components/Themed';
import { ModalHeader } from '../../components/ModalHeader';
import { Card } from '../../components/Card';
import { PrimaryButton } from '../../components/Buttons';
import { useAppState } from '../../lib/app-state';
import { fontFamilies } from '../../lib/theme';
import { todayQuestion, isoDate } from '../../lib/content';
import { getJSON, setJSON, StorageKeys } from '../../lib/storage';

interface ReflectionAnswer {
  date: string;
  questionId: string;
  text: string;
}

export default function QuestionScreen() {
  const { colors, fontScale } = useAppState();
  const question = todayQuestion();
  const today = isoDate();
  const [answer, setAnswer] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await getJSON<ReflectionAnswer[]>(StorageKeys.reflectionAnswers, []);
      const existing = list.find((a) => a.date === today && a.questionId === question.id);
      if (existing) {
        setAnswer(existing.text);
        setSaved(true);
      }
    })();
  }, [question.id, today]);

  const save = async () => {
    const list = await getJSON<ReflectionAnswer[]>(StorageKeys.reflectionAnswers, []);
    const rest = list.filter((a) => !(a.date === today && a.questionId === question.id));
    await setJSON(StorageKeys.reflectionAnswers, [...rest, { date: today, questionId: question.id, text: answer }]);
    setSaved(true);
  };

  return (
    <Screen style={{ flex: 1 }}>
      <ModalHeader title="سؤال اليوم" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Card style={{ backgroundColor: colors.primarySoft, borderColor: colors.primary, marginBottom: 18 }}>
            <ThemedText size={17} weight="medium" style={{ lineHeight: 28 }}>
              {question.text}
            </ThemedText>
          </Card>

          <ThemedText size={13} weight="medium" muted style={{ marginBottom: 8 }}>
            لا توجد إجابة صحيحة أو خاطئة — اكتب ما يخطر لك
          </ThemedText>
          <TextInput
            value={answer}
            onChangeText={(t) => {
              setAnswer(t);
              setSaved(false);
            }}
            multiline
            textAlign="right"
            placeholder="اكتب هنا..."
            placeholderTextColor={colors.textMuted}
            style={[
              styles.input,
              {
                color: colors.text,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                fontFamily: fontFamilies.regular,
                fontSize: Math.round(15 * fontScale),
              },
            ]}
          />

          <PrimaryButton
            label={saved ? 'تم الحفظ ✓' : 'حفظ الإجابة'}
            full
            disabled={!answer.trim() || saved}
            onPress={save}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  input: {
    minHeight: 140,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    textAlignVertical: 'top',
    writingDirection: 'rtl',
  },
});
