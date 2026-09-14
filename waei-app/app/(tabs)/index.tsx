import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, ThemedText } from '../../components/Themed';
import { Card } from '../../components/Card';
import { useAppState } from '../../lib/app-state';
import {
  ContentType,
  todayAthar,
  todayAyah,
  todayBlessing,
  todayFeaturedType,
  todayMoment,
  todayQuestion,
} from '../../lib/content';

interface CardMeta {
  type: ContentType;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  preview: string;
  route: string;
}

function useTodayCards(): CardMeta[] {
  const ayah = todayAyah();
  const blessing = todayBlessing();
  const question = todayQuestion();
  const moment = todayMoment();
  const athar = todayAthar();

  return [
    {
      type: 'ayah',
      title: 'آية اليوم',
      icon: 'book-outline',
      preview: `${ayah.surah} • ${ayah.ayahRef}`,
      route: '/content/ayah',
    },
    {
      type: 'blessing',
      title: 'نعمة اليوم',
      icon: 'sunny-outline',
      preview: blessing.text,
      route: '/content/blessing',
    },
    {
      type: 'question',
      title: 'سؤال اليوم',
      icon: 'help-circle-outline',
      preview: question.text,
      route: '/content/question',
    },
    {
      type: 'moment',
      title: 'لحظة مع الله',
      icon: 'heart-outline',
      preview: moment.lead,
      route: '/content/moment',
    },
    {
      type: 'athar',
      title: 'أثر اليوم',
      icon: 'leaf-outline',
      preview: athar.text,
      route: '/content/athar',
    },
  ];
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppState();
  const cards = useTodayCards();
  const featuredType = todayFeaturedType();
  const featured = cards.find((c) => c.type === featuredType) ?? cards[0];

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
        ]}
      >
        <ThemedText size={20} weight="bold" style={{ marginBottom: 4 }}>
          ما الشيء الذي أحتاج أن أعيه اليوم؟
        </ThemedText>
        <ThemedText size={13} muted style={{ marginBottom: 20 }}>
          توقف قليلًا، واقرأ ما يخصك اليوم.
        </ThemedText>

        <Card
          onPress={() => router.push(featured.route as never)}
          elevated
          style={{ backgroundColor: colors.primarySoft, borderColor: colors.primary, marginBottom: 22 }}
        >
          <View style={styles.heroHeader}>
            <View style={[styles.iconBubble, { backgroundColor: colors.primary }]}>
              <Ionicons name={featured.icon} size={20} color={colors.onPrimary} />
            </View>
            <ThemedText size={13} weight="medium" muted>
              وعي اليوم
            </ThemedText>
          </View>
          <ThemedText size={18} weight="bold" style={{ marginTop: 12, marginBottom: 8 }}>
            {featured.title}
          </ThemedText>
          <ThemedText size={15} numberOfLines={3} style={{ lineHeight: 24 }}>
            {featured.preview}
          </ThemedText>
        </Card>

        <View style={{ gap: 14 }}>
          {cards.map((card) => (
            <Card key={card.type} onPress={() => router.push(card.route as never)}>
              <View style={styles.row}>
                <View style={[styles.iconBubble, { backgroundColor: colors.surfaceAlt }]}>
                  <Ionicons name={card.icon} size={18} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText size={15} weight="bold" style={{ marginBottom: 4 }}>
                    {card.title}
                  </ThemedText>
                  <ThemedText size={13} muted numberOfLines={2}>
                    {card.preview}
                  </ThemedText>
                </View>
                <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBubble: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
