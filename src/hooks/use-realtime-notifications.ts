"use client";

import { createClient } from "@/lib/supabase/client";
import { Notification } from "@/types";
import { useEffect, useState } from "react";

export function useRealtimeNotifications(userId: string) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const supabase = createClient();

    // Load initial unread count
    supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", userId)
      .eq("is_read", false)
      .then(({ count }) => {
        setUnreadCount(count || 0);
      });

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new as Notification;
          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { notifications, unreadCount, setUnreadCount };
}
