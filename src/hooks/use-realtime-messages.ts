"use client";

import { createClient } from "@/lib/supabase/client";
import { Message, Profile } from "@/types";
import { useEffect, useState } from "react";

export function useRealtimeMessages(
  conversationId: string,
  initialMessages: (Message & { sender: Profile })[]
) {
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newMessage = payload.new as Message;

          // Check if message already exists (from optimistic update)
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;

            // Fetch sender profile
            supabase
              .from("profiles")
              .select("*")
              .eq("id", newMessage.sender_id)
              .single()
              .then(({ data: sender }) => {
                if (sender) {
                  setMessages((p) => {
                    if (p.some((m) => m.id === newMessage.id)) return p;
                    return [...p, { ...newMessage, sender }];
                  });
                }
              });

            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return messages;
}
