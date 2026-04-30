# PerpDEX Implementation Spec (VI)

## Mục tiêu
Tài liệu này chuyển yêu cầu sản phẩm thành checklist kỹ thuật theo phase để triển khai app Perpetual DEX React Native/Expo với 3 protocol: Hyperliquid, Lighter, Aster.

## Stack chuẩn
- Expo SDK 51+, React Native 0.74+, TypeScript strict
- Expo Router v3
- Zustand + TanStack Query v5
- NativeWind v4 + StyleSheet
- Web3: wagmi v2, viem v2, WalletConnect v2/Web3Modal
- Realtime: WebSocket native
- Storage: MMKV
- Animation: Reanimated 3

## Kiến trúc thư mục mục tiêu
Theo cấu trúc `app/`, `src/components`, `src/hooks`, `src/services/{hyperliquid,lighter,aster}`, `src/store`, `src/utils`, `src/constants`, `src/types`.

## Thứ tự triển khai (phases)
1. **Foundation**: cấu hình Expo Router, NativeWind, path aliases, theme tokens, QueryProvider, store skeleton.
2. **UI Library**: Button/Input/Badge/Toast/Skeleton/Modal/BottomSheet/SafeArea/Header.
3. **Protocol Layer**: unified `ProtocolService` + 3 adapter HL/Lighter/Aster (REST + WS + signing).
4. **Trading Modules**: CandlestickChart, OrderBook, TradeForm, LeverageSlider, PositionCard, OrderCard.
5. **Screens**: Home, Trade, Portfolio, Earn, Profile/Settings, Wallet flows.
6. **Wallet + Signing**: WalletConnect flow, typed-data signing, balance/account sync.
7. **Polish**: loading states, errors/toast, haptics, performance optimizations.

## Ưu tiên kỹ thuật bắt buộc
- Dùng testnet trước khi mainnet.
- Ưu tiên WS thay cho polling để giảm rate-limit pressure.
- Chuẩn hóa decimal precision theo từng market.
- Trade form phải có validation đầy đủ (balance, min size, invalid price).
- Có offline fallback: cache market list + last price vào MMKV.
- Error handling thống nhất, trả message thân thiện qua toast.

## Checklist Definition of Done
- App chạy trên iOS + Android.
- Protocol switching HL/Lighter/Aster hoạt động.
- Market data, orderbook, trades cập nhật realtime ổn định.
- Place/cancel order thành công với ký hợp lệ.
- Position/PNL hiển thị đúng và refresh đúng.
- `tsc --noEmit` pass, lint pass.

## Lưu ý triển khai
- `src/services/types.ts` là contract trung tâm.
- `src/services/index.ts` nên memoize service instance để tái sử dụng WS session.
- `src/store/useTradeStore.ts` nên giữ derived state (notional/margin/liq) đồng bộ theo setters.
