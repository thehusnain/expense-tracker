# Premium Expense Tracker (Mobile)

A high-end, visually stunning expense tracking mobile application built with React Native and Expo. This app features a premium dark theme, glassmorphism effects, and smooth animations to provide a top-tier user experience.

## ✨ Features

- **Premium UI/UX**: Sophisticated dark mode design using a custom slate-based palette.
- **Glassmorphism**: High-fidelity translucent cards and containers built with `expo-blur`.
- **Dynamic Animations**: 
  - Entry transitions for Login/Signup.
  - Interactive scroll-aware headers and balance cards on the Dashboard.
  - Scale and feedback animations on all buttons.
- **Persistent Storage**: Robust local database management using `expo-sqlite`.
- **Interactive Reports**: Filterable transaction history with trend indicators.
- **Quick Actions**: Easy access to adding transactions and core features.

## 🛠 Technology Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 55).
- **Icons**: [Lucide React Native](https://lucide.dev/guide/packages/lucide-react-native) for consistent, high-quality iconography.
- **Styling**: Vanilla StyleSheet with a custom Theme engine for consistent dark-mode aesthetics.
- **Animations**: React Native `Animated` API and `react-native-reanimated` (v4) with `react-native-worklets` for high-performance transitions.
- **Gradients**: `expo-linear-gradient` for premium visual depth.
- **Storage**: `expo-sqlite` for secure, offline-first data persistence.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Expo Go](https://expo.dev/expo-go) app installed on your physical device or an Android/iOS emulator.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the application:
   ```bash
   npx expo start
   ```

3. Scan the QR code:
   - Use the **Expo Go** app (Android) or **Camera** app (iOS) to scan the QR code displayed in your terminal.

## 📂 Project Structure

- `src/theme.js`: Central source of truth for the premium design system (colors, spacing, shadows).
- `src/components/GlassCard.jsx`: Reusable glassmorphism component.
- `src/database/db.js`: SQLite database logic and schema management.
- `src/components/`: Modular UI components (Login, Signup, Dashboard, etc.).

## 💡 Design Decisions

- **Why Dark Theme?** Provides a premium, sophisticated feel that reduces eye strain and looks modern.
- **Why Glassmorphism?** Adds visual depth and a "glassy" aesthetic that is synonymous with high-end mobile UI.
- **Why SQLite?** Ensures that your financial data stays on your device, providing privacy and fast offline access.
- **Why Expo?** Accelerates development and provides a robust set of universal APIs (like Blur and LinearGradients) that work seamlessly across platforms.

---

Built with ❤️ for a premium mobile experience.
