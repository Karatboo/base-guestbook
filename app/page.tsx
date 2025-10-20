"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { base } from "wagmi/chains";
import { contractAddress, contractAbi } from "@/lib/constants";
import { sdk } from "@farcaster/miniapp-sdk";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type Message = {
  sender: string;
  content: string;
  timestamp: bigint;
};

// ✅ Новый улучшенный компонент карточки сообщения
function MessageCard({ message }: { message: Message }) {
  const shortAddress = `${message.sender.substring(
    0,
    6
  )}...${message.sender.substring(message.sender.length - 4)}`;
  const date = new Date(Number(message.timestamp) * 1000).toLocaleString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm animate-fade-in space-y-3">
      <p className="text-gray-800 text-lg leading-relaxed">
        &ldquo;{message.content}&rdquo;
      </p>
      <div className="text-xs text-gray-400 flex justify-between items-center pt-3 border-t border-gray-100">
        <a
          href={`https://basescan.org/address/${message.sender}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono hover:text-blue-600 transition-colors"
        >
          {shortAddress}
        </a>
        <span className="font-mono">{date}</span>
      </div>
    </div>
  );
}

// ✅ Полностью переработанный главный компонент
export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const [message, setMessage] = useState("");
  const { address, isConnected, chain } = useAccount();

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
      chainId: base.id,
    });
  };

  const isSigning = isWritePending || isConfirming;
  const isWrongNetwork = isConnected && chain?.id !== base.id;

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto max-w-xl p-4 sm:p-6 space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Onchain Guestbook
          </h1>
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
          />
        </header>

        {isConnected && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <form onSubmit={handleSubmit}>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Leave Your Mark on Base
              </h2>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
                rows={4}
                maxLength={280}
              />
              <button
                type="submit"
                disabled={isWrongNetwork || isSigning || !message.trim()}
                className="w-full mt-4 px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isWrongNetwork
                  ? "Wrong Network"
                  : isSigning
                  ? "Signing..."
                  : "Sign the Guestbook"}
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
                    {hash.substring(0, 12)}...
                  </a>
                </div>
              )}
            </form>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">
            Messages ({totalMessages})
          </h3>
          {areMessagesLoading && (
            <p className="text-center text-gray-500 py-4">
              Loading messages...
            </p>
          )}
          {messages.length > 0
            ? [...messages]
                .reverse()
                .map((msg, index) => <MessageCard key={index} message={msg} />)
            : !areMessagesLoading &&
              !isConnected && (
                <div className="text-center text-gray-500 bg-white p-6 rounded-xl border border-gray-200">
                  Connect your wallet to see the guestbook.
                </div>
              )}
        </div>
      </main>
    </div>
  );
}
