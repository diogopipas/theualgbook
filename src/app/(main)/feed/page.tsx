import { createClient } from "@/lib/supabase/server";
import { PostComposer } from "@/components/feed/post-composer";
import { FeedList } from "@/components/feed/feed-list";

export default async function FeedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles!author_id(*)
    `
    )
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-4 py-4">
      <PostComposer avatarUrl={profile?.avatar_url} fullName={profile?.full_name || ""} />
      <FeedList initialPosts={posts || []} currentUserId={user.id} />
    </div>
  );
}
