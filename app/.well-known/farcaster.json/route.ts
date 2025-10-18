import { NextResponse } from "next/server";

export async function GET() {
  // ❗️ ЗАМЕНИ 'your-vercel-url.vercel.app' НА СВОЙ РЕАЛЬНЫЙ URL VERCEL
  const appUrl = "https://base-guestbook-твой-логин.vercel.app";

  const manifest = {
    // Это поле для верификации. Мы заполним его на следующем шаге. Пока оставляем пустым.
    accountAssociation: {
      header:
        "eyJmaWQiOjQ2NzY1MCwidHlwZSI6ImF1dGgiLCJrZXkiOiIweDEzMjI0ODNkNEJENzVGYmU1N2U5QUIwNDBiNTllMTZlZTExNjgxMTQifQ",
      payload: "eyJkb21haW4iOiJiYXNlLWd1ZXN0Ym9vay1ueWF3LnZlcmNlbC5hcHAifQ",
      signature:
        "LuBHmyOFe3VMiB8Krx/8bdtH7T4rlN94WzbbLRfZvqNSbgvkxN3BAzGZE/5RGg66poVtpGfC/vG2gCf4k/1vpxw=",
    },
    baseBuilder: {
      // ❗️ Вставь сюда адрес своего кошелька, с которого ты деплоил контракт.
      // Это даст тебе права на редактирование в будущем.
      allowedAddresses: ["0xaD5460EFAF11D4c34edFb8c0BbBDC660754084CB"],
    },
    miniapp: {
      version: "1",
      name: "Onchain Guestbook",
      homeUrl: appUrl,
      iconUrl: "https://i.ibb.co/hKCoPz9/base-logo-square-1.png", // Я подготовил для тебя иконку
      splashImageUrl: "https://i.ibb.co/L5h5zqs/base-guestbook-splash.png", // И сплэш-скрин
      splashBackgroundColor: "#0052FF",
      subtitle: "Leave your permanent mark on the Base blockchain.",
      description:
        "A simple and secure digital guestbook where anyone can sign a message that gets stored forever onchain. Powered by Base.",
      screenshotUrls: [
        "https://i.ibb.co/kH10b9r/base-guestbook-screen.png", // И скриншот
      ],
      primaryCategory: "social",
      tags: ["onchain", "guestbook", "base", "social"],
    },
  };

  return NextResponse.json(manifest);
}
