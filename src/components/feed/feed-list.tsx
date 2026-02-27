"use client";

import { PostCard } from "@/components/feed/post-card";
import { Post, Profile } from "@/types";

interface FeedListProps {
  initialPosts: (Post & { author: Profile })[];
  currentUserId: string;
}

export function FeedList({ initialPosts, currentUserId }: FeedListProps) {
  if (initialPosts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-fb-text-secondary">
          Ainda não há posts. Sê o primeiro a publicar!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {initialPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
