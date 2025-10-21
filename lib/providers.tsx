// lib/providers.tsx
"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  injectedWallet, // Наш главный приоритет
  metaMaskWallet, // Популярные опции
  coinbaseWallet,
  walletConnectWallet, // Запасной вариант
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http, createStorage } from "wagmi";
import { base } from "wagmi/chains";

const projectId = "9938872d5c52cb2a3e117c606d1dec14"; // Убедитесь, что это ваш Project ID

// ✅ НОВЫЙ ПОДХОД: Максимальный фокус на injected и WC
const connectors = connectorsForWallets(
  [
    {
      // Единственная группа, чтобы пользователь сразу видел нужные опции
      groupName: "Connect Wallet",
      wallets: [
        // ✅ Делаем injectedWallet максимально совместимым
        injectedWallet({
          shimDisconnect: true, // Улучшает стабильность отключения на мобильных
        }),
        // Оставляем популярные кошельки
        coinbaseWallet({
          appName: "Onchain Guestbook",
          preference: "smartWalletFirst",
        }), // Coinbase Smart Wallet тоже популярен на Base
        metaMaskWallet({ projectId, walletConnectVersion: "2" }), // Стандартный MetaMask
        // ✅ WalletConnect как универсальный метод для остальных (Trust Wallet и т.д.)
        // Мы передаем showQrModal: false здесь, это должно сработать по документации wagmi v2 / RainbowKit v1+
        walletConnectWallet({ projectId, showQrModal: false }),
      ],
    },
  ],
  {
    appName: "Onchain Guestbook",
    projectId: projectId,
  }
);

const config = createConfig({
  connectors,
  chains: [base],
  transports: { [base.id]: http() },
  // Оставляем все "фичи" для стабильности
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
        {/* Оставляем компактный режим */}
        <RainbowKitProvider modalSize="compact">{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
