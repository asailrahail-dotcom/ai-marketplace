import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { getJSON, setJSON, StorageKeys } from './storage';
import { colorsFor, textScale, ThemeColors, ThemeMode, TextSize } from './theme';
import {
  cancelReminder,
  requestNotificationPermission,
  scheduleDailyReminder,
} from './notifications';

export type OnboardingGoal =
  | 'assurance'
  | 'gratitude'
  | 'reflection'
  | 'closeness'
  | 'calm'
  | 'unsure';

export interface NotificationSettings {
  daily: { enabled: boolean; hour: number; minute: number };
  khalwa: { enabled: boolean };
  blessing: { enabled: boolean };
  athar: { enabled: boolean };
}

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  daily: { enabled: false, hour: 8, minute: 0 },
  khalwa: { enabled: false },
  blessing: { enabled: false },
  athar: { enabled: false },
};

interface AppStateShape {
  ready: boolean;
  onboardingCompleted: boolean;
  onboardingGoal: OnboardingGoal | null;
  completeOnboarding: (goal: OnboardingGoal, wantsReminder: boolean) => Promise<void>;

  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  resolvedScheme: 'light' | 'dark';
  colors: ThemeColors;

  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  fontScale: number;

  notifications: NotificationSettings;
  setDailyReminder: (enabled: boolean, hour?: number, minute?: number) => Promise<void>;
  setSimpleReminder: (key: 'khalwa' | 'blessing' | 'athar', enabled: boolean) => Promise<void>;
}

const AppStateContext = createContext<AppStateShape | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [onboardingGoal, setOnboardingGoal] = useState<OnboardingGoal | null>(null);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [systemScheme, setSystemScheme] = useState<'light' | 'dark'>(
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  );
  const [textSize, setTextSizeState] = useState<TextSize>('medium');
  const [notifications, setNotifications] = useState<NotificationSettings>(DEFAULT_NOTIFICATIONS);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    (async () => {
      const [completed, goal, mode, size, notif] = await Promise.all([
        getJSON(StorageKeys.onboardingCompleted, false),
        getJSON<OnboardingGoal | null>(StorageKeys.onboardingGoal, null),
        getJSON<ThemeMode>(StorageKeys.themeMode, 'system'),
        getJSON<TextSize>(StorageKeys.textSize, 'medium'),
        getJSON<NotificationSettings>(StorageKeys.notificationSettings, DEFAULT_NOTIFICATIONS),
      ]);
      setOnboardingCompleted(completed);
      setOnboardingGoal(goal);
      setThemeModeState(mode);
      setTextSizeState(size);
      setNotifications(notif);
      setReady(true);
    })();
  }, []);

  const completeOnboarding = useCallback(
    async (goal: OnboardingGoal, wantsReminder: boolean) => {
      setOnboardingCompleted(true);
      setOnboardingGoal(goal);
      await Promise.all([
        setJSON(StorageKeys.onboardingCompleted, true),
        setJSON(StorageKeys.onboardingGoal, goal),
        setJSON(StorageKeys.reminderOptIn, wantsReminder),
      ]);
    },
    [],
  );

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    setJSON(StorageKeys.themeMode, mode);
  }, []);

  const setTextSize = useCallback((size: TextSize) => {
    setTextSizeState(size);
    setJSON(StorageKeys.textSize, size);
  }, []);

  const setDailyReminder = useCallback(
    async (enabled: boolean, hour = 8, minute = 0) => {
      let granted = true;
      if (enabled) {
        granted = await requestNotificationPermission();
      }
      const finalEnabled = enabled && granted;
      const next: NotificationSettings = {
        ...notifications,
        daily: { enabled: finalEnabled, hour, minute },
      };
      setNotifications(next);
      await setJSON(StorageKeys.notificationSettings, next);
      if (finalEnabled) {
        await scheduleDailyReminder('daily', hour, minute);
      } else {
        await cancelReminder('daily');
      }
    },
    [notifications],
  );

  const setSimpleReminder = useCallback(
    async (key: 'khalwa' | 'blessing' | 'athar', enabled: boolean) => {
      let granted = true;
      if (enabled) {
        granted = await requestNotificationPermission();
      }
      const finalEnabled = enabled && granted;
      const next: NotificationSettings = {
        ...notifications,
        [key]: { enabled: finalEnabled },
      };
      setNotifications(next);
      await setJSON(StorageKeys.notificationSettings, next);
      const hours: Record<typeof key, number> = { khalwa: 20, blessing: 12, athar: 17 } as any;
      if (finalEnabled) {
        await scheduleDailyReminder(key, hours[key], 0);
      } else {
        await cancelReminder(key);
      }
    },
    [notifications],
  );

  const resolvedScheme = themeMode === 'system' ? systemScheme : themeMode;
  const colors = useMemo(() => colorsFor(resolvedScheme), [resolvedScheme]);
  const fontScale = textScale[textSize];

  const value: AppStateShape = {
    ready,
    onboardingCompleted,
    onboardingGoal,
    completeOnboarding,
    themeMode,
    setThemeMode,
    resolvedScheme,
    colors,
    textSize,
    setTextSize,
    fontScale,
    notifications,
    setDailyReminder,
    setSimpleReminder,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateShape {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
