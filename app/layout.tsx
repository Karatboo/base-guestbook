import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const inter = Inter({ subsets: ["latin"] });

// Убедитесь, что здесь ваш правильный URL
const appUrl = "https://base-guestbook-nyaw.vercel.app/";

export async function generateMetadata(): Promise<Metadata> {
  const SPLASH_IMAGE_URL = "https://i.ibb.co/FdM8931/icon.png";

  const miniAppManifest = {
    version: "next",
    imageUrl: SPLASH_IMAGE_URL, // Обновлено здесь
    button: {
      title: "Sign the Guestbook",
      action: {
        type: "launch_miniapp",
        name: "Onchain Guestbook",
        url: appUrl,
      },
    },
  };

  return {
    title: "Onchain Guestbook",
    description: "Leave your permanent mark on the Base blockchain.",

    openGraph: {
      title: "Onchain Guestbook",
      description: "Leave your permanent mark on the Base blockchain.",
      images: [miniAppManifest.imageUrl],
    },

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
