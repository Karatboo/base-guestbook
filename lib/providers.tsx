// lib/providers.tsx
"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  RainbowKitProvider,
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
import { WagmiProvider, createConfig, http, createStorage } from "wagmi";
import { base } from "wagmi/chains";

// ✅ 1. Создаем список кошельков для отображения
const connectors = connectorsForWallets(
  [
    {
      groupName: "Suggested",
      wallets: [
        injectedWallet, // Самый важный для Farcaster и мобильных браузеров
        metaMaskWallet,
        coinbaseWallet,
        rabbyWallet,
        walletConnectWallet, // Для Trust Wallet и других
      ],
    },
  ],
  {
    appName: "Onchain Guestbook",
    // ❗️ ВАЖНО: Вставьте сюда ваш Project ID из WalletConnect Cloud
    projectId: "f7049d16991221d6525a8b81b5782b42",
  }
);

// ✅ 2. Создаем финальную конфигурацию
const config = createConfig({
  connectors,
  chains: [base],
  transports: { [base.id]: http() },
  // ✅ Включаем "супер-режим" обнаружения ВСЕХ кошельков на телефоне
  multiInjectedProviderDiscovery: true,
  // ✅ Включаем "память", чтобы не слетало подключение после перезагрузки
  storage: createStorage({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  }),
  // ✅ Включаем поддержку SSR для Next.js
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
