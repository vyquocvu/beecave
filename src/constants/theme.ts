export const colors = {
  bg: {
    primary: '#0b0e11',
    secondary: '#1e2329',
    tertiary: '#2b3139',
    overlay: '#1e2329',
  },
  brand: {
    primary: '#FCD535',
    secondary: '#f0b90b',
  },
  up: '#0ecb81',
  down: '#f6465d',
  text: {
    primary: '#ffffff',
    secondary: '#eaecef',
    tertiary: '#707a8a',
    disabled: '#929aa5',
  },
  border: {
    default: '#2b3139',
    subtle: '#1e2329',
  },
  protocol: {
    hyperliquid: '#00D4AA',
    lighter: '#7B61FF',
    aster: '#FF6B35',
  },
} as const;

export const typography = {
  price: { fontSize: 40, fontWeight: '700' as const, letterSpacing: -0.3 },
  heading: { fontSize: 24, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
  mono: { fontFamily: 'SpaceMono', fontSize: 14 },
} as const;

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 80,
} as const;

export const radius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 9999,
} as const;

export type Colors = typeof colors;
