// lib/providers.tsx
"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  RainbowKitProvider,
  lightTheme, // Импортируем светлую тему для кастомизации
} from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rabbyWallet,
  zerionWallet,
  trustWallet, // ✅ 1. Импортируем Trust Wallet
  okxWallet, // ✅ 2. Импортируем OKX Wallet
  ledgerWallet, // ✅ 3. Импортируем Ledger (для десктопа)
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http, createStorage } from "wagmi";
import { base } from "wagmi/chains";

// ✅ 4. Создаем расширенный список кошельков
const connectors = connectorsForWallets(
  [
    {
      groupName: "Suggested",
      wallets: [
        injectedWallet, // Самый важный для Farcaster и мобильных браузеров
        coinbaseWallet,
        metaMaskWallet,
      ],
    },
    {
      groupName: "Popular",
      wallets: [
        rabbyWallet,
        trustWallet,
        zerionWallet,
        okxWallet,
        ledgerWallet,
        walletConnectWallet, // WalletConnect как универсальный вариант для всех остальных
      ],
    },
  ],
  {
    appName: "Onchain Guestbook",
    // Убедитесь, что здесь ваш правильный Project ID
    projectId: "9938872d5c52cb2a3e117c606d1dec14",
  }
);

// ✅ 5. Финальная, самая надежная конфигурация
const config = createConfig({
  connectors,
  chains: [base],
  transports: { [base.id]: http() },
  // Включаем обнаружение ВСЕХ кошельков на телефоне
  multiInjectedProviderDiscovery: true,
  // Включаем "память", чтобы подключение не слетало после перезагрузки
  storage: createStorage({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  }),
  // Включаем поддержку SSR для Next.js, чтобы избежать ошибок
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* ✅ 6. Добавляем кастомную тему и настройки для лучшего UX */}
        <RainbowKitProvider
          modalSize="compact"
          theme={lightTheme({
            accentColor: "#0052FF", // Цвет кнопки в стиле Base
            accentColorForeground: "white",
            borderRadius: "medium",
            fontStack: "system",
          })}
          showRecentTransactions={false} // Отключаем показ недавних транзакций
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
