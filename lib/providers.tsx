// lib/providers.tsx
"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  RainbowKitProvider,
  darkTheme, // Импортируем темную тему для стилизации
} from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rabbyWallet,
  zerionWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";

// ✅ ЭТО КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ
// Мы создаем группы кошельков, чтобы дать приоритет встроенному кошельку
const connectors = connectorsForWallets(
  [
    {
      // Эта группа появится первой и будет содержать кошелек, встроенный в браузер (Farcaster, MetaMask mobile и т.д.)
      groupName: "Browser Wallet",
      wallets: [injectedWallet],
    },
    {
      // Вторая группа с популярными кошельками, которые откроются по прямой ссылке
      groupName: "Popular",
      wallets: [
        coinbaseWallet,
        metaMaskWallet,
        rabbyWallet,
        zerionWallet,
        walletConnectWallet, // WalletConnect как запасной вариант для всех остальных
      ],
    },
  ],
  {
    appName: "Onchain Guestbook",
    // Убедитесь, что здесь ваш правильный Project ID
    projectId: "9938872d5c52cb2a3e117c606d1dec14",
  }
);

const config = createConfig({
  connectors,
  chains: [base],
  transports: { [base.id]: http() },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* Добавляем настройки в провайдер для лучшего мобильного опыта */}
        <RainbowKitProvider
          theme={darkTheme({
            // Опционально: красивая темная тема
            accentColor: "#0052FF",
            accentColorForeground: "white",
            borderRadius: "medium",
          })}
          modalSize="compact" // Делаем модальное окно компактным, идеально для телефонов
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
