"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toggleReaction } from "@/actions/reactions";

interface ReactionBarProps {
  postId: string;
  currentUserId: string;
  isButton?: boolean;
}

export function ReactionBar({ postId, currentUserId, isButton }: ReactionBarProps) {
  const [totalCount, setTotalCount] = useState(0);
  const [userReaction, setUserReaction] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadReactions() {
      const { data: reactions } = await supabase
        .from("reactions")
        .select("type, user_id")
        .eq("post_id", postId);

      if (reactions) {
        let myReaction: string | null = null;
        reactions.forEach((r) => {
          if (r.user_id === currentUserId) myReaction = r.type;
        });
        setUserReaction(myReaction);
        setTotalCount(reactions.length);
      }
    }

    loadReactions();
  }, [postId, currentUserId]);

  async function handleLike() {
    const wasLiked = userReaction === "like";
    setUserReaction(wasLiked ? null : "like");
    setTotalCount((p) => (wasLiked ? p - 1 : p + 1));
    await toggleReaction(postId, "post", "like");
  }

  if (isButton) {
    return (
      <button
        onClick={handleLike}
        style={{
          background: "none",
          border: "none",
          fontSize: "11px",
          fontFamily: "Arial, sans-serif",
          color: "#3b5998",
          fontWeight: userReaction ? "bold" : "normal",
          cursor: "pointer",
          padding: 0,
        }}
        onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
        onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        {userReaction ? "Já gosto" : "Gosto"}
      </button>
    );
  }

  if (totalCount === 0) return null;

  return (
    <div
      style={{
        padding: "2px 8px",
        fontSize: "11px",
        fontFamily: "Arial, sans-serif",
        color: "#999",
      }}
    >
      {totalCount} {totalCount === 1 ? "pessoa gosta" : "pessoas gostam"} disto
    </div>
  );
}
