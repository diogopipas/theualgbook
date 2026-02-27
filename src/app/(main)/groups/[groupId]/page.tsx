import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { PostComposer } from "@/components/feed/post-composer";
import { FeedList } from "@/components/feed/feed-list";
import { GroupHeaderSection } from "@/components/groups/group-header-section";

interface GroupPageProps {
  params: Promise<{ groupId: string }>;
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { groupId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: group } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (!group) notFound();

  // Check membership
  const { data: membership } = await supabase
    .from("group_members")
    .select("role")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .maybeSingle();

  // Get member count
  const { count: memberCount } = await supabase
    .from("group_members")
    .select("*", { count: "exact", head: true })
    .eq("group_id", groupId);

  // Get user profile for composer
  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url, full_name")
    .eq("id", user.id)
    .single();

  // Get group posts
  const { data: posts } = await supabase
    .from("posts")
    .select("*, author:profiles!author_id(*)")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-4 py-4">
      <GroupHeaderSection
        group={group}
        isMember={!!membership}
        userRole={membership?.role || null}
        memberCount={memberCount || 0}
      />

      {membership && (
        <PostComposer
          avatarUrl={profile?.avatar_url}
          fullName={profile?.full_name || ""}
          groupId={groupId}
        />
      )}

      <FeedList initialPosts={posts || []} currentUserId={user.id} />
    </div>
  );
}
