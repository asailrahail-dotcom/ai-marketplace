import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, ThemedText } from '../../components/Themed';
import { Card } from '../../components/Card';
import { PrimaryButton, SecondaryButton } from '../../components/Buttons';
import { useAppState } from '../../lib/app-state';
import { fontFamilies } from '../../lib/theme';
import { getJSON, setJSON, StorageKeys } from '../../lib/storage';

interface JournalEntry {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

function formatArabicDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const { colors, fontScale } = useAppState();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [mode, setMode] = useState<'list' | 'compose'>('list');
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const list = await getJSON<JournalEntry[]>(StorageKeys.journalEntries, []);
    setEntries(list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const openNew = () => {
    setEditingId(null);
    setDraft('');
    setMode('compose');
  };

  const openEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setDraft(entry.text);
    setMode('compose');
  };

  const save = async () => {
    const text = draft.trim();
    if (!text) return;
    const now = new Date().toISOString();
    let next: JournalEntry[];
    if (editingId) {
      next = entries.map((e) => (e.id === editingId ? { ...e, text, updatedAt: now } : e));
    } else {
      next = [...entries, { id: `${now}-${Math.random().toString(36).slice(2, 8)}`, text, createdAt: now, updatedAt: now }];
    }
    await setJSON(StorageKeys.journalEntries, next);
    setEntries(next.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
    setMode('list');
  };

  const remove = (id: string) => {
    Alert.alert('حذف الملاحظة', 'هل تريد حذف هذه الملاحظة؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: async () => {
          const next = entries.filter((e) => e.id !== id);
          await setJSON(StorageKeys.journalEntries, next);
          setEntries(next);
        },
      },
    ]);
  };

  if (mode === 'compose') {
    return (
      <Screen style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.composeHeader, { paddingTop: insets.top + 16, borderBottomColor: colors.border }]}>
            <ThemedText size={17} weight="bold">
              {editingId ? 'تعديل الملاحظة' : 'ملاحظة جديدة'}
            </ThemedText>
            <Pressable onPress={() => setMode('list')} hitSlop={10}>
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>
          <View style={styles.composeBody}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              multiline
              autoFocus
              textAlign="right"
              placeholder="اكتب مشاعرك أو تأملاتك هنا..."
              placeholderTextColor={colors.textMuted}
              style={[
                styles.textArea,
                {
                  color: colors.text,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  fontFamily: fontFamilies.regular,
                  fontSize: Math.round(15 * fontScale),
                },
              ]}
            />
            <PrimaryButton label="حفظ" full disabled={!draft.trim()} onPress={save} />
          </View>
        </KeyboardAvoidingView>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={[styles.listHeader, { paddingTop: insets.top + 20 }]}>
        <ThemedText size={20} weight="bold">
          مذكراتي
        </ThemedText>
        <Pressable
          onPress={openNew}
          accessibilityLabel="إضافة ملاحظة جديدة"
          style={[styles.addButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="add" size={22} color={colors.onPrimary} />
        </Pressable>
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 40 }]}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={40} color={colors.textMuted} />
            <ThemedText size={14} muted center style={{ marginTop: 12, maxWidth: 240, lineHeight: 22 }}>
              لا توجد ملاحظات بعد. مساحتك الشخصية بانتظار أول خاطرة.
            </ThemedText>
          </View>
        }
        renderItem={({ item }) => (
          <Card onPress={() => openEdit(item)} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <ThemedText size={12} muted>
                {formatArabicDate(item.updatedAt)}
              </ThemedText>
              <Pressable onPress={() => remove(item.id)} hitSlop={10}>
                <Ionicons name="trash-outline" size={16} color={colors.danger} />
              </Pressable>
            </View>
            <ThemedText size={15} numberOfLines={4} style={{ lineHeight: 24 }}>
              {item.text}
            </ThemedText>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
  },
  composeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  composeBody: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  textArea: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    textAlignVertical: 'top',
    writingDirection: 'rtl',
  },
});
