import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const inter = Inter({ subsets: ["latin"] });

// ❗️ ВАЖНО: ЗАМЕНИ 'your-vercel-url.vercel.app' НА СВОЙ РЕАЛЬНЫЙ URL VERCEL
const appUrl = "https://base-guestbook-твой-логин.vercel.app";

// 👇 ДОБАВЛЯЕМ ЭТУ ФУНКЦИЮ
export async function generateMetadata(): Promise<Metadata> {
  const fcMetadata: Record<string, string> = {
    "fc:frame": "vNext",
    "fc:frame:image": "https://i.ibb.co/L5h5zqs/base-guestbook-splash.png",
    "fc:frame:button:1": "Sign the Guestbook!",
    "fc:frame:post_url": appUrl,
    "fc:miniapp:name": "Onchain Guestbook",
    "fc:miniapp:image": "https://i.ibb.co/hKCoPz9/base-logo-square-1.png",
    "fc:miniapp:url": appUrl,
  };

  return {
    title: "Base Onchain Guestbook",
    description: "A simple and beautiful guestbook on the Base blockchain.",
    other: { ...fcMetadata },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
