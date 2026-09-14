import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, ThemedText } from '../../components/Themed';
import { Card } from '../../components/Card';
import { SegmentedControl } from '../../components/SegmentedControl';
import { useAppState } from '../../lib/app-state';
import { notificationsSupported } from '../../lib/notifications';

const HOUR_PRESETS = [6, 8, 10, 20];

function SectionTitle({ children }: { children: string }) {
  return (
    <ThemedText size={13} weight="bold" muted style={{ marginBottom: 10, marginTop: 26 }}>
      {children}
    </ThemedText>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  right,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  right: React.ReactNode;
}) {
  const { colors } = useAppState();
  return (
    <View style={styles.row}>
      <View style={[styles.iconBubble, { backgroundColor: colors.surfaceAlt }]}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText size={14} weight="medium">
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText size={12} muted style={{ marginTop: 2 }}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {right}
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const {
    colors,
    themeMode,
    setThemeMode,
    textSize,
    setTextSize,
    notifications,
    setDailyReminder,
    setSimpleReminder,
  } = useAppState();

  const supported = notificationsSupported();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
        ]}
      >
        <ThemedText size={20} weight="bold">
          الإعدادات
        </ThemedText>

        <SectionTitle>الحساب</SectionTitle>
        <Card>
          <ThemedText size={13} muted style={{ lineHeight: 22 }}>
            لا يوجد تسجيل دخول إجباري في هذه النسخة التجريبية. يمكنك استخدام التطبيق كاملًا دون إنشاء حساب.
          </ThemedText>
        </Card>

        <SectionTitle>الإشعارات</SectionTitle>
        {!supported ? (
          <Card style={{ marginBottom: 12 }}>
            <ThemedText size={12} muted style={{ lineHeight: 20 }}>
              الإشعارات المحلية متاحة على الجوال (iOS / Android). على الويب يتم حفظ التفضيل فقط.
            </ThemedText>
          </Card>
        ) : null}
        <Card>
          <SettingRow
            icon="notifications-outline"
            title="وعي اليوم"
            subtitle="تذكير يومي هادئ بلحظة وعي جديدة"
            right={
              <Switch
                value={notifications.daily.enabled}
                onValueChange={(v) => setDailyReminder(v, notifications.daily.hour, notifications.daily.minute)}
                trackColor={{ true: colors.primary }}
              />
            }
          />
          {notifications.daily.enabled ? (
            <View style={styles.hourRow}>
              {HOUR_PRESETS.map((h) => {
                const active = notifications.daily.hour === h;
                return (
                  <Pressable
                    key={h}
                    onPress={() => setDailyReminder(true, h, 0)}
                    style={[
                      styles.hourChip,
                      {
                        backgroundColor: active ? colors.primary : colors.surfaceAlt,
                      },
                    ]}
                  >
                    <ThemedText size={12} weight="medium" color={active ? colors.onPrimary : colors.text}>
                      {h}:00
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <SettingRow
            icon="moon-outline"
            title="تذكير الخلوة"
            subtitle="دعوة مسائية هادئة لخلوة قصيرة"
            right={
              <Switch
                value={notifications.khalwa.enabled}
                onValueChange={(v) => setSimpleReminder('khalwa', v)}
                trackColor={{ true: colors.primary }}
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <SettingRow
            icon="sunny-outline"
            title="تذكير النعمة"
            subtitle="تنبيه لملاحظة نعمة في منتصف اليوم"
            right={
              <Switch
                value={notifications.blessing.enabled}
                onValueChange={(v) => setSimpleReminder('blessing', v)}
                trackColor={{ true: colors.primary }}
              />
            }
          />
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <SettingRow
            icon="leaf-outline"
            title="أثر اليوم"
            subtitle="تذكير بفعل بسيط يمكن تقديمه اليوم"
            right={
              <Switch
                value={notifications.athar.enabled}
                onValueChange={(v) => setSimpleReminder('athar', v)}
                trackColor={{ true: colors.primary }}
              />
            }
          />
        </Card>

        <SectionTitle>المظهر</SectionTitle>
        <Card>
          <SegmentedControl
            value={themeMode}
            onChange={setThemeMode}
            options={[
              { value: 'light', label: 'فاتح' },
              { value: 'dark', label: 'داكن' },
              { value: 'system', label: 'تلقائي' },
            ]}
          />
        </Card>

        <SectionTitle>حجم النص</SectionTitle>
        <Card>
          <SegmentedControl
            value={textSize}
            onChange={setTextSize}
            options={[
              { value: 'small', label: 'صغير' },
              { value: 'medium', label: 'متوسط' },
              { value: 'large', label: 'كبير' },
            ]}
          />
        </Card>

        <SectionTitle>الخصوصية</SectionTitle>
        <Card>
          <ThemedText size={13} muted style={{ lineHeight: 22, marginBottom: 8 }}>
            مذكراتك شخصية، تُحفظ على جهازك فقط ولا تُشارك مع أي جهة.
          </ThemedText>
          <ThemedText size={13} muted style={{ lineHeight: 22 }}>
            لا يطلب التطبيق الوصول إلى موقعك الجغرافي، ولا يطلب أي صلاحيات غير ضرورية لعمله.
          </ThemedText>
        </Card>

        <ThemedText size={11} muted center style={{ marginTop: 28 }}>
          وعي — نسخة تجريبية 1.0.0
        </ThemedText>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  iconBubble: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },
  hourRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 4,
    paddingRight: 44,
  },
  hourChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
});
