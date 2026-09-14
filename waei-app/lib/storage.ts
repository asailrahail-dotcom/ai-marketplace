import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function setJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage failures are non-fatal for this app; the UI keeps working in-memory
  }
}

export const StorageKeys = {
  onboardingCompleted: 'waei.onboarding.completed',
  onboardingGoal: 'waei.onboarding.goal',
  reminderOptIn: 'waei.onboarding.reminderOptIn',
  themeMode: 'waei.settings.themeMode',
  textSize: 'waei.settings.textSize',
  notificationSettings: 'waei.settings.notifications',
  gratitudeLog: 'waei.data.gratitudeLog',
  athrDone: 'waei.data.athrDone',
  momentDone: 'waei.data.momentDone',
  reflectionAnswers: 'waei.data.reflectionAnswers',
  savedAyat: 'waei.data.savedAyat',
  journalEntries: 'waei.data.journalEntries',
  khalwaSessions: 'waei.data.khalwaSessions',
} as const;
