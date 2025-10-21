// lib/providers.tsx
"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  // ✅ 1. Импортируем базовые функции создания кошельков
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  rabbyWallet,
  zerionWallet,
  trustWallet,
  okxWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http, createStorage } from "wagmi";
import { base } from "wagmi/chains";

const projectId = "9938872d5c52cb2a3e117c606d1dec14"; // Убедитесь, что это ваш Project ID

// ✅ 2. СОЗДАЕМ КОНФИГУРИРОВАННЫЕ ВЕРСИИ КОШЕЛЬКОВ (ПРАВИЛЬНЫЙ СПОСОБ)
// Мы создаем новые функции, которые вызывают оригинальные с нужными параметрами.

const configuredInjectedWallet = injectedWallet({
  shimDisconnect: true, // Улучшает стабильность отключения на мобильных
});

const configuredWalletConnect = walletConnectWallet({
  projectId,
  showQrModal: false, // Говорим НЕ показывать QR-код на мобильных
});

// ✅ 3. Используем КОНФИГУРИРОВАННЫЕ функции в connectorsForWallets
const connectors = connectorsForWallets(
  [
    {
      groupName: "Suggested",
      wallets: [
        configuredInjectedWallet, // Используем нашу настроенную версию
        coinbaseWallet({
          appName: "Onchain Guestbook",
          preference: "smartWalletFirst",
        }),
        metaMaskWallet({ projectId, walletConnectVersion: "2" }),
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
        configuredWalletConnect, // Используем нашу настроенную версию
      ],
    },
  ],
  {
    appName: "Onchain Guestbook",
    projectId: projectId,
  }
);

// ✅ 4. Конфигурация Wagmi остается прежней (она уже правильная)
const config = createConfig({
  connectors,
  chains: [base],
  transports: { [base.id]: http() },
  multiInjectedProviderDiscovery: true,
  storage: createStorage({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  }),
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
