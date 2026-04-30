export const colors = {
  bg: {
    primary: '#0A0B0E',
    secondary: '#13151A',
    tertiary: '#1C1F28',
    overlay: '#242731',
  },
  brand: {
    primary: '#F0B429',
    secondary: '#E8A800',
  },
  up: '#0ECB81',
  down: '#F6465D',
  text: {
    primary: '#FFFFFF',
    secondary: '#8B92A5',
    tertiary: '#5A6072',
    disabled: '#3D4255',
  },
  border: {
    default: '#252836',
    subtle: '#1E2130',
  },
  protocol: {
    hyperliquid: '#00D4AA',
    lighter: '#7B61FF',
    aster: '#FF6B35',
  },
} as const;

export const typography = {
  price: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  heading: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  mono: { fontFamily: 'SpaceMono', fontSize: 13 },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export type Colors = typeof colors;
