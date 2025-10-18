import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const inter = Inter({ subsets: ["latin"] });

const appUrl = "https://base-guestbook-nyaw.vercel.app/";

export async function generateMetadata(): Promise<Metadata> {
  // This is the JSON object Farcaster expects for a Mini App embed
  const miniAppManifest = {
    version: "next",
    imageUrl: "https://i.ibb.co/L5h5zqs/base-guestbook-splash.png", // The main image for the cast
    button: {
      title: "Sign the Guestbook",
      action: {
        type: "launch_miniapp",
        name: "Onchain Guestbook", // The name that appears when launching
        url: appUrl,
      },
    },
  };

  return {
    title: "Onchain Guestbook",
    description: "Leave your permanent mark on the Base blockchain.",

    // Standard OpenGraph tags for better sharing on other platforms (Twitter, Discord, etc.)
    openGraph: {
      title: "Onchain Guestbook",
      description: "Leave your permanent mark on the Base blockchain.",
      images: [miniAppManifest.imageUrl],
    },

    // The single, correct meta tag for Farcaster Mini Apps
    other: {
      "fc:miniapp": JSON.stringify(miniAppManifest),
    },
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
