export type ColorScheme = 'light' | 'dark';
export type ThemeMode = ColorScheme | 'system';
export type TextSize = 'small' | 'medium' | 'large';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  primary: string;
  primarySoft: string;
  onPrimary: string;
  text: string;
  textMuted: string;
  textOnPrimary: string;
  border: string;
  divider: string;
  danger: string;
}

export const lightColors: ThemeColors = {
  background: '#F6F3EC',
  surface: '#FFFFFF',
  surfaceAlt: '#EFEAE0',
  card: '#FBF9F3',
  primary: '#6E8F6B',
  primarySoft: '#DEE9DA',
  onPrimary: '#FFFFFF',
  text: '#2B2B28',
  textMuted: '#71695E',
  textOnPrimary: '#FFFFFF',
  border: '#E5DFD1',
  divider: '#EAE4D7',
  danger: '#B15A4A',
};

export const darkColors: ThemeColors = {
  background: '#191A17',
  surface: '#222420',
  surfaceAlt: '#2A2C26',
  card: '#22241F',
  primary: '#93BA8D',
  primarySoft: '#33402F',
  onPrimary: '#16210F',
  text: '#ECE9E0',
  textMuted: '#AAA69B',
  textOnPrimary: '#16210F',
  border: '#34362F',
  divider: '#2D2F29',
  danger: '#D98A78',
};

export function colorsFor(scheme: ColorScheme): ThemeColors {
  return scheme === 'dark' ? darkColors : lightColors;
}

export const textScale: Record<TextSize, number> = {
  small: 0.9,
  medium: 1,
  large: 1.18,
};

export const fontFamilies = {
  regular: 'Tajawal_400Regular',
  medium: 'Tajawal_500Medium',
  bold: 'Tajawal_700Bold',
};
