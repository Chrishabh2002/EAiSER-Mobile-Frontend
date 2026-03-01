const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    textMuted: '#9BA1A6',
    background: '#fff',
    card: '#F8F9FA',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primary: '#0891B2',
    secondary: '#6366F1',
    border: '#E6E8EB',
    error: '#EF4444',
    success: '#22C55E',
    warning: '#F59E0B',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    textMuted: '#687076',
    background: '#151718',
    card: '#1F2123',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#22D3EE',
    secondary: '#818CF8',
    border: '#2A2F33',
    error: '#F87171',
    success: '#4ADE80',
    warning: '#FBBF24',
  },
};

export type ColorTheme = typeof Colors.light;