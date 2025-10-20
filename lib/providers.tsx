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

const connectors = connectorsForWallets(
  [
    {
      groupName: "Suggested",
      wallets: [
        injectedWallet,
        metaMaskWallet,
        coinbaseWallet,
        rabbyWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: "Onchain Guestbook",
    // Убедитесь, что здесь ваш правильный Project ID
    projectId: "f7049d16991221d6525a8b81b5782b42",
  }
);

const config = createConfig({
  connectors,
  chains: [base],
  transports: { [base.id]: http() },
  // Включаем обнаружение всех кошельков на телефоне
  multiInjectedProviderDiscovery: true,
  // Включаем "память", чтобы подключение не слетало
  storage: createStorage({
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  }),
  // Включаем поддержку SSR для Next.js
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
