# Ajwani Store - Mobile (React Native / Expo)

React Native port of the web frontend. Built with Expo (managed workflow), Redux, React Navigation.

## Setup

```
cd mobile
npm install
cp .env.example .env
# edit .env -> EXPO_PUBLIC_BACKEND_URL=http://<your-ip>:5000
npm start
```

Then scan the QR with **Expo Go** (Android / iOS), or press `a` / `i` for emulators.

## Backend URL notes

- Android emulator: `http://10.0.2.2:5000`
- iOS simulator: `http://localhost:5000`
- Physical device: `http://<your-LAN-ip>:5000` (machine running `npm run dev` in `backend/`)

## What's ported

- All 21 screens
- Redux store + 6 slices (cart, user, product, order, coupon, vendor) — same constants/reducers as web
- AsyncStorage replaces `localStorage` for cart / userInfo / shippingAddress / paymentMethod
- Drawer + Stack navigation replaces `react-router-dom`

## Payments

The PaymentScreen is **stubbed**. Wire up `@stripe/stripe-react-native` and/or PayPal RN SDK later — search for `// TODO PAYMENT` markers.

## Differences from web

- No `react-helmet` (irrelevant for native).
- Image upload uses `expo-image-picker`.
- `window.confirm` -> `Alert.alert`.
- Pagination is a horizontal scroll of pills.
