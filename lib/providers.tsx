// lib/providers.tsx
"use client";
import "@rainbow-me/rainbowkit/styles.css"; // Импортируем стили RainbowKit
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";

// ✅ Новая, более надёжная конфигурация с использованием RainbowKit
const config = createConfig({
  chains: [base],
  transports: { [base.id]: http() },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* Оборачиваем всё в RainbowKitProvider */}
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
