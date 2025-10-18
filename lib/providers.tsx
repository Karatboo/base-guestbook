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
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";

// Определяем список кошельков, которые мы хотим показывать в интерфейсе RainbowKit
const connectors = connectorsForWallets(
  [
    {
      groupName: "Suggested",
      wallets: [
        injectedWallet, // Самый важный для Farcaster и мобильных браузеров
        metaMaskWallet,
        coinbaseWallet,
        rabbyWallet,
        zerionWallet,
        walletConnectWallet, // Для всех остальных (включая Trust Wallet)
      ],
    },
  ],
  {
    appName: "Onchain Guestbook",
    // Убедитесь, что здесь ваш правильный Project ID
    projectId: "9938872d5c52cb2a3e117c606d1dec14",
  }
);

// ✅ ЭТО ГЛАВНОЕ ИСПРАВЛЕНИЕ
// Создаем конфигурацию wagmi с включенным "супер-режимом" обнаружения
const config = createConfig({
  connectors,
  chains: [base],
  transports: { [base.id]: http() },
  // Эта строчка принудительно включает обнаружение ВСЕХ установленных кошельков (EIP-6963)
  multiInjectedProviderDiscovery: true,
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
