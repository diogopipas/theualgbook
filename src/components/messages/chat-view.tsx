"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sendMessage } from "@/actions/messages";
import { useRealtimeMessages } from "@/hooks/use-realtime-messages";
import { Message, Profile } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ChatViewProps {
  conversationId: string;
  currentUserId: string;
  otherUser: {
    full_name: string;
    username: string;
    avatar_url: string | null;
  };
  initialMessages: (Message & { sender: Profile })[];
}

export function ChatView({
  conversationId,
  currentUserId,
  otherUser,
  initialMessages,
}: ChatViewProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = useRealtimeMessages(conversationId, initialMessages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.set("conversationId", conversationId);
    formData.set("content", content);
    await sendMessage(formData);
    setContent("");
    setIsLoading(false);
  }

  return (
    <Card className="flex h-[calc(100vh-120px)] flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-fb-border px-4 py-3">
        <Link href="/messages" className="lg:hidden">
          <ArrowLeft className="h-5 w-5 text-fb-text-secondary" />
        </Link>
        <Avatar src={otherUser.avatar_url} alt={otherUser.full_name} size="sm" />
        <Link
          href={`/profile/${otherUser.username}`}
          className="text-sm font-semibold text-fb-text hover:underline"
        >
          {otherUser.full_name}
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-2">
          {messages.map((msg) => {
            const isMine = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-3 py-2 ${
                    isMine
                      ? "bg-fb-blue text-white"
                      : "bg-fb-gray-light text-fb-text"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`mt-0.5 text-[10px] ${
                      isMine ? "text-white/70" : "text-fb-text-muted"
                    }`}
                  >
                    {formatRelativeTime(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-fb-border px-4 py-3"
      >
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreve uma mensagem..."
          className="flex-1 rounded-full bg-fb-gray-light px-4 py-2 text-sm text-fb-text placeholder:text-fb-text-muted focus:outline-none"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="sm"
          isLoading={isLoading}
          disabled={!content.trim()}
          className="rounded-full p-2"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
