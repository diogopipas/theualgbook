"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { ReactionBar } from "@/components/feed/reaction-bar";
import { CommentSection } from "@/components/feed/comment-section";
import { formatRelativeTime } from "@/lib/utils";
import { Post, Profile } from "@/types";
import { deletePost } from "@/actions/posts";

interface PostCardProps {
  post: Post & { author: Profile };
  currentUserId: string;
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = post.author_id === currentUserId;

  async function handleDelete() {
    if (!confirm("Tens a certeza que queres eliminar esta publicação?")) return;
    setIsDeleting(true);
    await deletePost(post.id);
  }

  if (isDeleting) return null;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e5e5",
        marginBottom: "8px",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "6px 8px",
          borderBottom: "1px solid #e5e5e5",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
          <Link href={`/profile/${post.author.username}`}>
            <Avatar src={post.author.avatar_url} alt={post.author.full_name} size="sm" />
          </Link>
          <div>
            <div style={{ fontSize: "11px", fontFamily: "Arial, sans-serif" }}>
              <Link
                href={`/profile/${post.author.username}`}
                style={{
                  fontWeight: "bold",
                  color: "#3b5998",
                  textDecoration: "none",
                }}
                onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                {post.author.full_name}
              </Link>
            </div>
            <div style={{ fontSize: "11px", color: "#999", fontFamily: "Arial, sans-serif" }}>
              {formatRelativeTime(post.created_at)}
            </div>
          </div>
        </div>

        {isOwner && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                background: "none",
                border: "none",
                color: "#999",
                fontSize: "11px",
                fontFamily: "Arial, sans-serif",
                cursor: "pointer",
                padding: "0 4px",
              }}
            >
              ▾
            </button>
            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  zIndex: 10,
                  minWidth: "120px",
                }}
              >
                <button
                  onClick={handleDelete}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "4px 8px",
                    fontSize: "11px",
                    fontFamily: "Arial, sans-serif",
                    color: "#cc0000",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  Eliminar publicação
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "6px 8px" }}>
        <p
          style={{
            fontSize: "11px",
            fontFamily: "Arial, sans-serif",
            color: "#333",
            whiteSpace: "pre-wrap",
            margin: 0,
          }}
        >
          {post.content}
        </p>
      </div>

      {/* Images */}
      {post.image_urls && post.image_urls.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: post.image_urls.length === 1 ? "1fr" : "1fr 1fr",
            gap: "1px",
          }}
        >
          {post.image_urls.map((url, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                aspectRatio: post.image_urls.length === 1 ? "16/9" : "1",
              }}
            >
              <Image src={url} alt="" fill style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>
      )}

      {/* Reaction counts */}
      <ReactionBar postId={post.id} currentUserId={currentUserId} />

      {/* Action links */}
      <div
        style={{
          borderTop: "1px solid #e5e5e5",
          padding: "3px 8px",
          display: "flex",
          gap: "8px",
        }}
      >
        <ReactionBar postId={post.id} currentUserId={currentUserId} isButton />
        <span style={{ color: "#ccc", fontSize: "11px" }}>·</span>
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            background: "none",
            border: "none",
            fontSize: "11px",
            fontFamily: "Arial, sans-serif",
            color: "#3b5998",
            cursor: "pointer",
            padding: 0,
          }}
          onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Comentar
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection postId={post.id} currentUserId={currentUserId} />
      )}
    </div>
  );
}
