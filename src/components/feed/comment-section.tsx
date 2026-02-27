"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { createComment } from "@/actions/comments";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Comment, Profile } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

interface CommentSectionProps {
  postId: string;
  currentUserId: string;
}

export function CommentSection({ postId, currentUserId }: CommentSectionProps) {
  const { profile } = useCurrentUser();
  const [comments, setComments] = useState<(Comment & { author: Profile })[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function loadComments() {
      const { data } = await supabase
        .from("comments")
        .select("*, author:profiles!author_id(*)")
        .eq("post_id", postId)
        .is("parent_id", null)
        .order("created_at", { ascending: true });

      if (data) setComments(data as (Comment & { author: Profile })[]);
    }

    loadComments();
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.set("content", content);
    formData.set("postId", postId);

    await createComment(formData);

    if (profile) {
      setComments((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          post_id: postId,
          author_id: currentUserId,
          parent_id: null,
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          author: profile,
        },
      ]);
    }

    setContent("");
    setIsLoading(false);
  }

  return (
    <div
      style={{
        borderTop: "1px solid #e5e5e5",
        backgroundColor: "#f5f5f5",
        padding: "6px 8px",
      }}
    >
      {/* Comment list */}
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            fontSize: "11px",
            fontFamily: "Arial, sans-serif",
            color: "#333",
            padding: "2px 0",
            borderBottom: "1px solid #e8e8e8",
          }}
        >
          <Link
            href={`/profile/${comment.author.username}`}
            style={{
              fontWeight: "bold",
              color: "#3b5998",
              textDecoration: "none",
            }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            {comment.author.full_name}
          </Link>
          {": "}
          <span>{comment.content}</span>
          <span style={{ color: "#999", marginLeft: "6px" }}>
            {formatRelativeTime(comment.created_at)}
          </span>
        </div>
      ))}

      {/* Comment input */}
      <form
        onSubmit={handleSubmit}
        style={{ marginTop: "4px", display: "flex", gap: "4px" }}
      >
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreve um comentário..."
          disabled={isLoading}
          style={{
            flex: 1,
            height: "20px",
            fontSize: "11px",
            fontFamily: "Arial, sans-serif",
            border: "1px solid #ccc",
            padding: "0 4px",
            outline: "none",
            color: "#333",
          }}
        />
        <button
          type="submit"
          disabled={!content.trim() || isLoading}
          style={{
            fontSize: "11px",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#3b5998",
            color: "#fff",
            border: "1px solid #2d4373",
            padding: "0 8px",
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
