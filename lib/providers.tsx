// lib/providers.tsx
"use client";
import "@rainbow-me/rainbowkit/styles.css"; // Импортируем стили RainbowKit
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";

// ✅ ЭТО САМОЕ ГЛАВНОЕ ИСПРАВЛЕНИЕ
// Создаем список коннекторов, который RainbowKit будет показывать пользователю.
// injectedWallet - это ключ к работе внутри Farcaster и других мобильных приложений.
const connectors = connectorsForWallets(
  [
    {
      groupName: "Suggested",
      wallets: [
        injectedWallet,
        metaMaskWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: "Onchain Guestbook",
    // ❗️ ВАЖНО: Вставьте сюда ваш Project ID из WalletConnect Cloud
    projectId: "9938872d5c52cb2a3e117c606d1dec14",
  }
);

// Создаем новую, полную конфигурацию
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
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
