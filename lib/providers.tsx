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
  trustWallet, // ✅ We'll explicitly add Trust Wallet for better detection
  rabbyWallet,
  zerionWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http, createStorage } from "wagmi";
import { base } from "wagmi/chains";

// ✅ THIS IS THE FINAL MOST ROBUST CONFIGURATION
// This setup prioritizes the in-app browser wallet (like Farcaster's)
// and provides deep links for other mobile wallets.
const connectors = connectorsForWallets(
  [
    {
      groupName: "Suggested",
      wallets: [
        injectedWallet, // This is CRITICAL for the Farcaster in-app wallet
        coinbaseWallet, // Has good mobile integration
        metaMaskWallet, // A popular choice
      ],
    },
    {
      groupName: "Other Wallets",
      wallets: [
        trustWallet,
        rabbyWallet,
        zerionWallet,
        walletConnectWallet, // This will now correctly open other apps on mobile
      ],
    },
  ],
  {
    appName: "Onchain Guestbook",
    // Make sure this is your correct Project ID
    projectId: "9938872d5c52cb2a3e117c606d1dec14", 
  }
);

const config = createConfig({
  connectors,
  chains: [base],
  transports: { [base.id]: http() },
  // This forces wagmi to actively look for ALL injected wallets on mobile
  multiInjectedProviderDiscovery: true,
  // This ensures the connection state persists after a page refresh
  storage: createStorage({ storage: typeof window !== 'undefined' ? window.localStorage : undefined }),
  // Required for Next.js to prevent hydration errors
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">{children}</RainbowKitProvider>
      </Query-ClientProvider>
    </WagmiProvider>
  );
}