import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileInfo } from "@/components/profile/profile-info";
import { FeedList } from "@/components/feed/feed-list";
import { PostComposer } from "@/components/feed/post-composer";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  // Get friendship status
  let friendshipStatus: string | null = null;
  let friendshipId: string | null = null;

  if (user.id !== profile.id) {
    const { data: friendship } = await supabase
      .from("friendships")
      .select("id, status")
      .or(
        `and(requester_id.eq.${user.id},addressee_id.eq.${profile.id}),and(requester_id.eq.${profile.id},addressee_id.eq.${user.id})`
      )
      .maybeSingle();

    if (friendship) {
      friendshipStatus = friendship.status;
      friendshipId = friendship.id;
    }
  }

  // Get user posts
  const { data: posts } = await supabase
    .from("posts")
    .select("*, author:profiles!author_id(*)")
    .eq("author_id", profile.id)
    .is("group_id", null)
    .order("created_at", { ascending: false })
    .limit(20);

  const isOwner = user.id === profile.id;

  return (
    <div style={{ paddingTop: "4px" }}>
      {/* Title bar */}
      <div
        style={{
          backgroundColor: "#3b5998",
          padding: "4px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Perfil de {profile.full_name}
        </span>
        <span
          style={{
            fontSize: "11px",
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            color: "#d8dfea",
          }}
        >
          Universidade do Algarve
        </span>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
        {/* Left column: photo + actions */}
        <div style={{ width: "175px", flexShrink: 0 }}>
          <ProfileHeader
            profile={profile}
            currentUserId={user.id}
            friendshipStatus={friendshipStatus}
            friendshipId={friendshipId}
          />
        </div>

        {/* Right column: info + posts */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ProfileInfo profile={profile} />

          {isOwner && (
            <PostComposer
              avatarUrl={profile.avatar_url}
              fullName={profile.full_name}
            />
          )}

          <FeedList initialPosts={posts || []} currentUserId={user.id} />
        </div>
      </div>
    </div>
  );
}
