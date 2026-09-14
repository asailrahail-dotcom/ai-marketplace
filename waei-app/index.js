// Custom entry so RTL is forced before expo-router registers the root
// component - by the time app/_layout.tsx runs, the web root's `dir`
// attribute (and native layout direction) would already be locked in.
const { I18nManager, Platform } = require('react-native');

if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

// react-native-web's I18nManager is a no-op stub (it never mirrors layout),
// so RTL there has to be applied the plain web way: a `dir` attribute that
// CSS flexbox reads to mirror `flexDirection: 'row'` children.
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  document.documentElement.dir = 'rtl';
  document.documentElement.lang = 'ar';
}

require('expo-router/entry');
