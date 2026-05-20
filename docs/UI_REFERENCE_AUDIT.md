# Mobile Trading UI Audit (Public Reference)

This document enumerates core mobile exchange UI surfaces and reusable UI components required to replicate the user experience in this repository. It is based on publicly accessible references (help center articles, product guides, and publicly shared screenshots). Exact feature parity that depends on proprietary backend services is treated as UI-only in the initial phase.

## Target Surfaces

### 1) Trading Dashboard (Trade)
- Trading pair header: symbol selector, favorite toggle, quick access actions
- Price ticket: mark/last price, 24h change, 24h high/low, volume
- Chart module: timeframe selector, chart type selector, indicators/draw tools entry, full-screen chart entry
- Market microstructure: order book panel, recent trades panel (toggle between views)
- Order placement panel: buy/sell toggle, order type selector, price/size fields, leverage, margin mode, TP/SL controls, reduce-only toggle, submit CTA
- Positions & orders: positions summary, open orders, order history entry points

### 2) Order Placement Panel (Execution)
Reusable controls:
- Side switch: Buy/Long vs Sell/Short
- Order type: Market / Limit (+ optional trigger/stop variants)
- Quantity & price inputs with inline validation and quick-fill chips (e.g., 25/50/75/100%)
- Leverage selector (slider or stepper) and margin mode (Cross/Isolated)
- TP/SL: enable toggle + price inputs
- Confirmation sheet: summary, fees estimate, risk warnings

### 3) Asset Management Overview (Assets / Portfolio / Activity)
- Total assets overview: total value, available balance, PnL (where applicable)
- Quick actions: Deposit, Withdraw, Buy, Sell, Earn
- Asset list: searchable list, per-asset row with balance and value
- Activity: transactions timeline, open orders, recurring buys state (UI-only if unavailable)
- Earn entry: allocation cards, promotions banners (UI-only)

### 4) Real-Time Price Charting Module
Core chart capabilities described by public educational material:
- Timeframes (e.g., 1m, 5m, 15m, 1h, 4h, 1d)
- Candlestick/line chart switching
- Indicators (moving averages, RSI) and settings
- Drawing tools entry (trendline, support/resistance)
- Full-screen mode and crosshair interactions

### 5) User Authentication Flow (UI Only)
Auth UI surfaces for parity (backend integration out of scope for first pass):
- Entry: Sign in / Sign up
- Email/phone + password forms
- Verification code screen (6-digit OTP)
- Post-auth security enrollment: enable authenticator, passkey, anti-phishing code, device management (navigation + UI shells)

### 6) Settings Menu
Primary sections:
- Account & Security (2FA, passkeys, device management)
- Notifications preferences
- Trading preferences (order confirmation, defaults)
- Appearance (dark mode)
- About/legal/help

## Reusable Components Inventory

### Layout
- Screen container with safe area + consistent horizontal padding
- Section header row (title + optional action)
- Card / panel container with exchange-like surface elevation
- List row (icon + label + value + chevron)
- Bottom sheet (modal) patterns for selectors

### Inputs & Controls
- Primary/secondary buttons (including “Buy” and “Sell” semantic variants)
- Segmented controls (2-way and multi-tab)
- Numeric input with currency/unit suffix
- Leverage selector (sheet + quick steps)
- Toggle switches (TP/SL, reduce-only)

### Data Display
- Price/percent badges (up/down)
- Asset row item
- Order book row
- Trade history row
- Skeleton placeholders

### Motion
- Screen enter transitions (fade/slide)
- Press feedback (opacity scale)
- Bottom sheet open/close transitions

## Design System (Implementation Targets)
- Dark-first surfaces with high contrast text
- Semantic colors: green for up/buy, red for down/sell
- Numeric typography hierarchy: price and PnL are primary; labels are secondary/tertiary
- Compact spacing rhythm optimized for dense trading surfaces

## Feature Parity Checklist (UI)
- [ ] Tabs navigation: Home, Markets, Trade, Assets, Account
- [ ] Trade dashboard composition matches reference layout density
- [ ] Order placement panel supports all toggles and validation states
- [ ] Assets overview supports quick actions and asset list
- [ ] Chart module supports timeframe + indicator entry points
- [ ] Auth UI flow screens present (login/register/verify)
- [ ] Settings and security navigation shells present
- [ ] Responsive behavior verified across common widths (360/390/414+)

## Public References Used
- Exchange learn article: “How to trade perpetuals on mobile”
- Exchange help article: “Activity & Portfolio pages”
- Exchange learn article: “How to read crypto charts”
- Exchange help articles: account security enhancement + 2FA reset
