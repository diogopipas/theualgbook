import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { Users } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  if (!q) {
    return (
      <div className="py-4">
        <Card className="p-8 text-center">
          <h1 className="mb-2 text-xl font-bold text-fb-text">Pesquisar</h1>
          <p className="text-sm text-fb-text-muted">
            Usa a barra de pesquisa para encontrar pessoas, grupos e posts.
          </p>
        </Card>
      </div>
    );
  }

  const supabase = await createClient();

  // Search users
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .or(`full_name.ilike.%${q}%,username.ilike.%${q}%`)
    .limit(10);

  // Search groups
  const { data: groups } = await supabase
    .from("groups")
    .select("*")
    .ilike("name", `%${q}%`)
    .eq("privacy", "public")
    .limit(10);

  // Search posts
  const { data: posts } = await supabase
    .from("posts")
    .select("*, author:profiles!author_id(*)")
    .ilike("content", `%${q}%`)
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(10);

  const hasResults =
    (users && users.length > 0) ||
    (groups && groups.length > 0) ||
    (posts && posts.length > 0);

  return (
    <div className="space-y-4 py-4">
      <h1 className="text-lg font-bold text-fb-text">
        Resultados para &quot;{q}&quot;
      </h1>

      {!hasResults && (
        <Card className="p-8 text-center">
          <p className="text-sm text-fb-text-muted">
            Nenhum resultado encontrado.
          </p>
        </Card>
      )}

      {/* People */}
      {users && users.length > 0 && (
        <Card className="p-4">
          <h2 className="mb-3 text-base font-bold text-fb-text">Pessoas</h2>
          <div className="space-y-2">
            {users.map((profile) => (
              <Link
                key={profile.id}
                href={`/profile/${profile.username}`}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-fb-gray-light"
              >
                <Avatar
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  size="md"
                />
                <div>
                  <p className="text-sm font-semibold text-fb-text">
                    {profile.full_name}
                  </p>
                  {profile.course && (
                    <p className="text-xs text-fb-text-muted">
                      {profile.course}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Groups */}
      {groups && groups.length > 0 && (
        <Card className="p-4">
          <h2 className="mb-3 text-base font-bold text-fb-text">Grupos</h2>
          <div className="space-y-2">
            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-fb-gray-light"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-fb-blue">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-fb-text">
                    {group.name}
                  </p>
                  {group.description && (
                    <p className="line-clamp-1 text-xs text-fb-text-muted">
                      {group.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Posts */}
      {posts && posts.length > 0 && (
        <Card className="p-4">
          <h2 className="mb-3 text-base font-bold text-fb-text">Posts</h2>
          <div className="space-y-3">
            {posts.map((post) => {
              const author = post.author as {
                full_name: string;
                username: string;
                avatar_url: string | null;
              };
              return (
                <div
                  key={post.id}
                  className="rounded-lg border border-fb-border p-3"
                >
                  <Link
                    href={`/profile/${author.username}`}
                    className="text-sm font-semibold text-fb-text hover:underline"
                  >
                    {author.full_name}
                  </Link>
                  <p className="mt-1 line-clamp-3 text-sm text-fb-text">
                    {post.content}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
