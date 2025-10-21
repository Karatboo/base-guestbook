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
  walletConnectWallet, // Импортируем как есть
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

// ✅ ЭТО КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ
const connectors = connectorsForWallets(
  [
    {
      groupName: "Suggested",
      wallets: [injectedWallet, coinbaseWallet, metaMaskWallet],
    },
    {
      groupName: "Popular",
      wallets: [
        rabbyWallet,
        trustWallet,
        zerionWallet,
        okxWallet,
        ledgerWallet,
        // ✅ Применяем опцию showQrModal: false прямо здесь
        walletConnectWallet({
          projectId,
          showQrModal: false, // Говорим НЕ показывать QR-код на мобильных
        }),
      ],
    },
  ],
  {
    appName: "Onchain Guestbook",
    projectId: projectId,
    // ❌ Убираем walletConnectParameters отсюда, так как опция переехала
  }
);

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
