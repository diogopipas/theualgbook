"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { createPost } from "@/actions/posts";

interface PostComposerProps {
  avatarUrl?: string | null;
  fullName: string;
  groupId?: string;
}

export function PostComposer({ avatarUrl, fullName, groupId }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.set("content", content);
    formData.set("visibility", "friends");
    if (groupId) formData.set("groupId", groupId);

    await createPost(formData);
    setContent("");
    setIsLoading(false);
  }

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e5e5",
        marginBottom: "8px",
      }}
    >
      <div
        style={{
          backgroundColor: "#3b5998",
          padding: "3px 6px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Escrever na parede
        </span>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "8px" }}>
        <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
          <Avatar src={avatarUrl} alt={fullName} size="sm" />
          <div style={{ flex: 1 }}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="No que estás a pensar?"
              rows={3}
              style={{
                width: "100%",
                fontSize: "11px",
                fontFamily: "Arial, sans-serif",
                border: "1px solid #ccc",
                padding: "4px",
                resize: "vertical",
                outline: "none",
                color: "#333",
                boxSizing: "border-box",
              }}
            />
            <div style={{ marginTop: "4px", textAlign: "right" }}>
              <button
                type="submit"
                disabled={!content.trim() || isLoading}
                style={{
                  fontSize: "11px",
                  fontFamily: "Arial, sans-serif",
                  fontWeight: "bold",
                  backgroundColor: isLoading ? "#ccc" : "#3b5998",
                  color: "#fff",
                  border: "1px solid #2d4373",
                  padding: "2px 8px",
                  cursor: isLoading ? "default" : "pointer",
                }}
              >
                {isLoading ? "A publicar..." : "Publicar"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
