export const baseColors = {
  bg: {
    primary: '#0B0B0D',
    secondary: '#121318',
    tertiary: '#171922',
    overlay: '#1F2230',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A7B8',
    tertiary: '#6E768A',
    disabled: '#3B4050',
  },
  border: {
    default: '#232634',
    subtle: '#1C1F2B',
  },
  semantic: {
    buy: '#0ECB81',
    sell: '#F6465D',
    warning: '#F5A524',
  },
  accent: {
    primary: '#5B8CFF',
  },
} as const;

export const baseTypography = {
  title: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.2 },
  heading: { fontSize: 16, fontWeight: '600' as const, letterSpacing: -0.1 },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  price: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.6 },
} as const;

export const baseSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const baseRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export type BaseColors = typeof baseColors;
