# PerpDEX — Multi-Protocol Perpetuals Trading App

A production-grade React Native (Expo) mobile trading app for perpetual DEXes. UI inspired by OKX Mobile, with first-class support for three protocols:

- **Hyperliquid**
- **Lighter**
- **Aster DEX**

One wallet, one UI, three order books.

---

## Tech stack

| Area             | Choice                                                  |
| ---------------- | ------------------------------------------------------- |
| Runtime          | Expo SDK 51+, React Native 0.74, TypeScript (strict)    |
| Navigation       | Expo Router v3 (file-based, typed routes)               |
| State            | Zustand + `zustand/middleware` persist (MMKV-backed)    |
| Async data       | TanStack Query v5                                       |
| Styling          | NativeWind v4 (Tailwind) + design tokens                |
| Animation        | Reanimated 3, Gesture Handler                           |
| Wallet           | wagmi v2 + viem v2 + `@web3modal/wagmi-react-native`    |
| Sheets / modals  | `@gorhom/bottom-sheet`                                  |
| Lists            | `@shopify/flash-list`                                   |
| Charts           | `react-native-wagmi-charts` (candles, optional)         |
| Storage          | `react-native-mmkv`                                     |

---

## Features

- **Multi-protocol switcher** — switch between Hyperliquid / Lighter / Aster without leaving the app. Each protocol has its own REST + WebSocket adapter behind a shared interface.
- **Live market data** — real-time candles, order book, recent trades, and mark prices over reconnecting WebSocket with exponential backoff.
- **Full trade form** — limit / market / stop-limit / stop-market orders with leverage slider, TP/SL, reduce-only, size-% quick buttons.
- **Portfolio** — open positions (with unrealized PnL & ROE), open orders, and trade history, per protocol.
- **Wallet** — WalletConnect v2 via Web3Modal; EIP-712 typed-data signing for each protocol (HL Agent, Lighter Order, Aster PlaceOrder).
- **Earn tab** — vault strategies and funding-rate arbitrage previews.
- **Onboarding + settings** — notifications, security/app-lock, theme toggle.
- **Dark-first** design system with semantic up/down colors and per-protocol accent.

---

## Directory structure

```
beecave/
├── app/                         # Expo Router routes
│   ├── _layout.tsx              # Root stack + providers
│   ├── +not-found.tsx
│   ├── onboarding.tsx
│   ├── (tabs)/                  # Home / Trade / Portfolio / Earn / Profile
│   ├── trade/[symbol].tsx       # Trading screen
│   ├── trade/orderbook.tsx      # Full-screen book
│   ├── wallet/                  # deposit / withdraw modals
│   └── settings/                # index / notifications / security
├── src/
│   ├── components/              # ui/ trading/ market/ wallet/ layout/
│   ├── constants/               # theme, protocols, markets, config
│   ├── hooks/                   # useMarketData, useOrderBook, useTrading, useSigner, ...
│   ├── providers/               # QueryProvider, WalletProvider
│   ├── services/                # http, ws + hyperliquid / lighter / aster adapters
│   ├── store/                   # useAppStore, useTradeStore, useMarketStore, ...
│   ├── types/                   # protocol, market, order, position, wallet
│   └── utils/                   # format, math, validation, storage, haptics
├── app.json, babel.config.js, metro.config.js, tailwind.config.js, tsconfig.json
└── .env.example
```

---

## Getting started

```bash
# 1. install deps
npm install

# 2. configure env
cp .env.example .env
# fill in EXPO_PUBLIC_WC_PROJECT_ID and protocol endpoints

# 3. run
npx expo start        # dev server
npx expo run:ios      # native iOS build
npx expo run:android  # native Android build
```

### Environment variables

See `.env.example`. All client-readable keys are prefixed `EXPO_PUBLIC_`:

- `EXPO_PUBLIC_WC_PROJECT_ID` — WalletConnect Cloud project id
- `EXPO_PUBLIC_HYPERLIQUID_API_URL` / `_WS_URL`
- `EXPO_PUBLIC_LIGHTER_API_URL` / `_WS_URL`
- `EXPO_PUBLIC_ASTER_API_URL` / `_WS_URL`

---

## Architecture

### Protocol abstraction

Every protocol implements the `ProtocolService` interface in `src/services/types.ts`:

```ts
interface ProtocolService {
  getMarkets(): Promise<Market[]>;
  getOrderbook(symbol: string): Promise<Orderbook>;
  getCandles(symbol: string, interval: CandleInterval): Promise<Candle[]>;
  getPositions(address: string): Promise<Position[]>;
  getOpenOrders(address: string): Promise<Order[]>;
  placeOrder(params: PlaceOrderParams, signer: WalletSigner): Promise<OrderResult>;
  cancelOrder(id: string, signer: WalletSigner): Promise<void>;
  // ...
  ws(): ProtocolWebSocket;
}
```

Pick a service at runtime:

```ts
import { createProtocolService } from '@/services';
const svc = createProtocolService('hyperliquid'); // 'lighter' | 'aster'
```

`createProtocolService` memoizes instances per protocol so WebSocket sessions are reused.

### Signing

UI gets a unified `WalletSigner` from `useSigner()`, which wraps wagmi's `WalletClient`. Each protocol adapter builds its own EIP-712 typed-data object (Agent / Order / PlaceOrder) and calls `signer.signTypedData(...)`.

### State split

- **`useAppStore`** — user-facing preferences (selected protocol, theme, favorites, recents). Persisted to MMKV.
- **`useTradeStore`** — working trade form; derives `notional`, `margin`, `liquidationPrice` on every setter.
- **`useMarketStore`** — cached markets + live prices pushed by WebSocket.
- **`useWalletStore`** — wagmi connection state mirror (address, isConnected, balances, snapshot).
- **`useToastStore`** — global toast queue rendered by `ToastHost`.

### Data flow

```
WebSocket ──▶ ReconnectingWebSocket ──▶ ProtocolWebSocket ──▶ setPrice / setOrderbook ──▶ Zustand ──▶ UI
REST     ──▶ ProtocolService        ──▶ TanStack Query     ──▶ UI
Form     ──▶ useTradeStore          ──▶ placeOrder         ──▶ ProtocolService.placeOrder ──▶ toast + invalidate
```

---

## Build order (reference)

1. Scaffold configs (Expo, TS, Tailwind, Babel, env)
2. Theme / types / constants
3. Zustand stores + utilities (format, math, validation, storage, haptics)
4. Protocol services (HTTP, WS, HL/Lighter/Aster adapters, factory)
5. UI component library (Button, Input, Tabs, BottomSheet, Toast, Card, ...)
6. Trading/market/wallet components + hooks
7. App router screens (tabs, trade, wallet, settings, onboarding)

---

## Notes & caveats

- The candlestick chart is a lightweight flex-based renderer; swap in `react-native-wagmi-charts` for richer interactions.
- Hyperliquid signing relies on SHA-256; install `react-native-quick-crypto` and wire it via the Expo config plugin for native crypto.
- This repository scaffolds the app — live endpoints, contract addresses, and exact typed-data schemas must be set according to the latest protocol docs before shipping to users.

---

## License

MIT
