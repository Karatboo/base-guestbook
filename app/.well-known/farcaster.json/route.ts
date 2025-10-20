import { NextResponse } from "next/server";

export async function GET() {
  const appUrl = "https://base-guestbook-nyaw.vercel.app/";

  const manifest = {
    accountAssociation: {
      header:
        "eyJmaWQiOjQ2NzY1MCwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDEzMjI0ODNkNEJENzVGYmU1N2U5QUIwNDBiNTllMTZlZTExNjgxMTQifQ",
      payload: "eyJkb21haW4iOiJiYXNlLWd1ZXN0Ym9vay1ueWF3LnZlcmNlbC5hcHAifQ",
      signature:
        "LuBHmyOFe3VMiB8Krx/8bdtH7T4rlN94WzbbLRfZvqNSbgvkxN3BAzGZE/5RGg66poVtpGfC/vG2gCf4k/1vpxw=",
    },
    baseBuilder: {
      allowedAddresses: ["0xaD5460EFAF11D4c34edFb8c0BbBDC660754084CB"],
    },
    miniapp: {
      version: "1",
      name: "Onchain Guestbook",
      homeUrl: appUrl,
      iconUrl: `${appUrl}icon.png`,
      // ✅ Указываем путь к нашему локальному изображению
      splashImageUrl: `${appUrl}splash.png`,
      splashBackgroundColor: "#F0F4F9",
      subtitle: "Leave your mark onchain.",
      description:
        "A simple and secure digital guestbook where anyone can sign a message that gets stored forever onchain. Powered by Base.",
      screenshotUrls: [
        `${appUrl}splash.png`, // Можно использовать то же изображение
      ],
      primaryCategory: "social",
      tags: ["onchain", "guestbook", "base", "social"],
    },
  };

  return NextResponse.json(manifest);
}
