import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export type ReminderKey = 'daily' | 'khalwa' | 'blessing' | 'athar';

const IDENTIFIERS: Record<ReminderKey, string> = {
  daily: 'waei-daily-awareness',
  khalwa: 'waei-khalwa-reminder',
  blessing: 'waei-blessing-reminder',
  athar: 'waei-athar-reminder',
};

const REMINDER_COPY: Record<ReminderKey, { title: string; body: string }> = {
  daily: { title: 'وعي اليوم', body: 'لحظة وعي صغيرة بانتظارك اليوم.' },
  khalwa: { title: 'خلوة هادئة', body: 'هل لديك دقائق قليلة الآن لخلوة مع الله؟' },
  blessing: { title: 'نعمة اليوم', body: 'توقف قليلًا والتفت إلى نعمة تحيط بك الآن.' },
  athar: { title: 'أثر اليوم', body: 'فرصة بسيطة اليوم لتترك أثرًا طيبًا.' },
};

export function notificationsSupported(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!notificationsSupported()) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return !!requested.granted;
}

export async function cancelReminder(key: ReminderKey): Promise<void> {
  if (!notificationsSupported()) return;
  await Notifications.cancelScheduledNotificationAsync(IDENTIFIERS[key]).catch(() => {});
}

export async function scheduleDailyReminder(
  key: ReminderKey,
  hour: number,
  minute: number,
): Promise<void> {
  if (!notificationsSupported()) return;
  await cancelReminder(key);
  const { title, body } = REMINDER_COPY[key];
  await Notifications.scheduleNotificationAsync({
    identifier: IDENTIFIERS[key],
    content: { title, body, sound: false },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
