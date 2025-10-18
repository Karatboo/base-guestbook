"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { contractAddress, contractAbi } from "@/lib/constants";
import { sdk } from "@farcaster/miniapp-sdk";

// КОМПОНЕНТ 1: Логотип (без изменений)
function BaseLogo() {
  return (
    <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-blue-600 shadow-lg flex items-center justify-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24 34.32C18.3006 34.32 13.68 29.6994 13.68 24C13.68 18.3006 18.3006 13.68 24 13.68C29.6994 13.68 34.32 18.3006 34.32 24C34.32 25.4216 34.0345 26.776 33.5283 28.0243C33.4588 28.196 33.2389 28.2862 33.0672 28.2167L30.1332 26.9657C29.9328 26.8851 29.8327 26.6548 29.9132 26.4544C30.2974 25.643 30.504 24.7431 30.504 23.7936C30.504 20.1833 27.5691 17.2464 24 17.2464C20.4309 17.2464 17.496 20.1833 17.496 23.7936C17.496 27.4038 20.4309 30.3408 24 30.3408C25.071 30.3408 26.0963 30.0768 26.9818 29.6102C27.1723 29.5101 27.4026 29.5906 27.4832 29.791L28.9056 33.125C28.9861 33.3254 28.886 33.5557 28.6856 33.6363C27.2793 34.093 25.698 34.32 24 34.32Z"
          fill="white"
        />
      </svg>
    </div>
  );
}

type Message = {
  sender: string;
  content: string;
  timestamp: bigint;
};

// КОМПОНЕНТ 2: Карточка сообщения
function MessageCard({ message }: { message: Message }) {
  const shortAddress = `${message.sender.substring(
    0,
    6
  )}...${message.sender.substring(message.sender.length - 4)}`;
  const date = new Date(Number(message.timestamp) * 1000).toLocaleString();

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200 shadow-sm transition-all hover:shadow-md animate-fade-in">
      <p className="text-gray-800 break-words text-lg">
        &ldquo;{message.content}&rdquo;
      </p>
      <div className="text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span>
          By:{" "}
          <a
            href={`https://basescan.org/address/${message.sender}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            {shortAddress}
          </a>
        </span>
        <span className="font-mono">{date}</span>
      </div>
    </div>
  );
}

// КОМПОНЕНТ 3: Главная страница
export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const [message, setMessage] = useState("");
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
  } = useWriteContract();

  const { data: totalMessagesData, refetch: refetchTotal } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getTotalMessages",
  });
  const totalMessages = totalMessagesData ? Number(totalMessagesData) : 0;

  const messageContracts = Array.from({ length: totalMessages }).map(
    (_, index) => ({
      address: contractAddress,
      abi: contractAbi,
      functionName: "messages",
      args: [BigInt(index)],
    })
  );

  const {
    data: messagesData,
    refetch: refetchMessages,
    isLoading: areMessagesLoading,
  } = useReadContracts({
    contracts: messageContracts,
    query: { enabled: totalMessages > 0 },
  });

  const messages: Message[] =
    messagesData
      ?.map((msg) => {
        if (Array.isArray(msg.result) && msg.result.length === 3) {
          // 👇 ЭТА СТРОЧКА ИЗМЕНЕНА! Добавлено `as unknown`
          const [sender, content, timestamp] = msg.result as unknown as [
            string,
            string,
            bigint
          ];
          return { sender, content, timestamp };
        }
        return null;
      })
      .filter((msg): msg is Message => msg !== null) || [];

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  useEffect(() => {
    if (isConfirmed) {
      refetchTotal().then(() => refetchMessages());
      setMessage("");
    }
  }, [isConfirmed, refetchTotal, refetchMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "sign",
      args: [message],
    });
  };

  const isSigning = isWritePending || isConfirming;

  if (!isClient) {
    return null;
  }

  return (
    <main className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8 font-sans">
      <BaseLogo />
      <header className="flex justify-between items-center mb-8 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Onchain Guestbook
        </h1>
        {isConnected ? (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 hidden sm:block font-mono">{`${address?.substring(
              0,
              6
            )}...${address?.substring(address.length - 4)}`}</span>
            <button
              onClick={() => disconnect()}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm transition-all duration-200 ease-in-out hover:border-gray-400 hover:shadow-md hover:-translate-y-px"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={() => connect({ connector: injected() })}
            className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-px bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-700"
          >
            Connect Wallet
          </button>
        )}
      </header>

      {isConnected && (
        <div className="mb-8">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Leave Your Mark on Base
            </h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              rows={4}
              maxLength={280}
            />
            <button
              type="submit"
              disabled={isSigning || !message.trim()}
              className="w-full mt-4 px-4 py-3 font-bold text-white bg-blue-600 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-0.5 disabled:bg-gray-400 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 bg-gradient-to-r from-blue-600 to-blue-800 border border-blue-700"
            >
              {isSigning ? "Signing..." : "Sign the Guestbook"}
            </button>
            {hash && (
              <div className="mt-3 text-center text-xs text-gray-500">
                Tx:{" "}
                <a
                  href={`https://basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {hash.substring(0, 10)}...
                </a>
              </div>
            )}
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">
          Messages ({totalMessages})
        </h3>
        {areMessagesLoading && (
          <p className="text-center text-gray-500">Loading messages...</p>
        )}
        {messages.length > 0
          ? [...messages]
              .reverse()
              .map((msg, index) => <MessageCard key={index} message={msg} />)
          : !areMessagesLoading && (
              <p className="text-center text-gray-500 bg-white/50 p-6 rounded-lg">
                Be the first to sign the guestbook!
              </p>
            )}
      </div>
    </main>
  );
}
