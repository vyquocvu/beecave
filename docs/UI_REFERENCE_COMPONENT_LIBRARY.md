# UI Reference Component Library

This repository implements a reference trading UI as an isolated route group under `/app/base`, backed by a small design-system layer under `/src/base`.

## Routes
- `/base` (tabs)
  - Home: `/app/base/(tabs)/home.tsx`
  - Markets: `/app/base/(tabs)/markets.tsx`
  - Trade: `/app/base/trade/[symbol].tsx`
  - Assets: `/app/base/(tabs)/assets.tsx`
  - Account: `/app/base/(tabs)/account.tsx`
- Auth (UI-only):
  - `/base/auth` entry, `/base/auth/login`, `/base/auth/register`, `/base/auth/verify`
- Settings (UI-only):
  - `/base/settings`, `/base/settings/security`, `/base/settings/notifications`

## Design Tokens
- `baseColors`, `baseTypography`, `baseSpacing`, `baseRadius`: [theme.ts](file:///Users/vyquocvu/Development/beecave/src/base/theme.ts)

## Components

### BaseScreen
- Path: [BaseScreen.tsx](file:///Users/vyquocvu/Development/beecave/src/base/components/layout/BaseScreen.tsx)
- Purpose: Safe area + base background + responsive horizontal padding + enter transition.

### BaseText
- Path: [BaseText.tsx](file:///Users/vyquocvu/Development/beecave/src/base/components/ui/BaseText.tsx)
- Props: `variant` (`title|heading|body|caption|price`), `color`, standard `TextProps`.

### BaseCard
- Path: [BaseCard.tsx](file:///Users/vyquocvu/Development/beecave/src/base/components/ui/BaseCard.tsx)
- Props: `padded` (default true), standard `ViewProps`.

### BaseButton
- Path: [BaseButton.tsx](file:///Users/vyquocvu/Development/beecave/src/base/components/ui/BaseButton.tsx)
- Variants: `primary|secondary|buy|sell|ghost`
- Sizes: `sm|md|lg`

### BaseSegmentedControl
- Path: [BaseSegmentedControl.tsx](file:///Users/vyquocvu/Development/beecave/src/base/components/ui/BaseSegmentedControl.tsx)
- Generic segments for 2+ options.

## Tests
- Jest config: [jest.config.js](file:///Users/vyquocvu/Development/beecave/jest.config.js)
- Component tests live alongside base UI components:
  - [BaseButton.test.tsx](file:///Users/vyquocvu/Development/beecave/src/base/components/ui/__tests__/BaseButton.test.tsx)
  - [BaseSegmentedControl.test.tsx](file:///Users/vyquocvu/Development/beecave/src/base/components/ui/__tests__/BaseSegmentedControl.test.tsx)
