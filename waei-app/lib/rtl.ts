import { I18nManager, Platform } from 'react-native';

// The whole app is Arabic-only, so RTL is forced rather than following the
// device locale. On web this applies immediately (react-native-web reads
// I18nManager.isRTL at render time). On native it only takes effect after
// the JS bundle reloads, since native layout direction is read at process
// launch - that reload is triggered once, automatically, below.
export function ensureRTL(): void {
  if (I18nManager.isRTL) return;

  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);

  if (Platform.OS === 'web') return;

  if (__DEV__) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { DevSettings } = require('react-native');
      DevSettings?.reload?.();
    } catch {
      // no dev reload available; the next manual reload will pick up RTL
    }
  }
}
