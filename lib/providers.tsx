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
  walletConnectWallet, // Keep this import as is
  rabbyWallet,
  zerionWallet,
  trustWallet,
  okxWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http, createStorage } from "wagmi";
import { base } from "wagmi/chains";

// ✅ THIS IS THE KEY FIX
// Configure WalletConnect to hide the QR code on mobile devices
const projectId = "9938872d5c52cb2a3e117c606d1dec14"; // Make sure this is your Project ID

const connectors = connectorsForWallets(
  [
    {
      groupName: "Suggested",
      wallets: [
        injectedWallet, // Priority for Farcaster in-app wallet
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
        // Explicitly configure WalletConnect for better mobile handling
        walletConnectWallet({
          projectId,
          showQrModal: false, // This tells WC NOT to show QR on mobile
        }),
      ],
    },
  ],
  {
    appName: "Onchain Guestbook",
    projectId: projectId, // Use the projectId defined above
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
