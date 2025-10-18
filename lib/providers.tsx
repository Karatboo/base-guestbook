// lib/providers.tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// ✅ NEW, MORE ROBUST CONFIGURATION
const config = createConfig({
  chains: [base],
  connectors: [
    injected({
      // This shim helps wagmi identify and properly connect to
      // the Farcaster in-app wallet provider on mobile.
      shimDisconnect: true,
      metaMaskCapabilities: {
        // This tells the connector to prioritize the Farcaster EIP-6963 provider
        // if it exists, ensuring a seamless connection on mobile.
        "eip6963:requestProvider": true,
      },
    }),
  ],
  transports: { [base.id]: http() },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
