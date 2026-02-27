import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Plus, Users } from "lucide-react";

export default async function GroupsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Get user's groups
  const { data: myMemberships } = await supabase
    .from("group_members")
    .select("group_id, role, groups(*)")
    .eq("user_id", user.id);

  // Get public groups for discovery
  const { data: allGroups } = await supabase
    .from("groups")
    .select("*")
    .eq("privacy", "public")
    .order("created_at", { ascending: false })
    .limit(20);

  const myGroupIds = new Set(myMemberships?.map((m) => m.group_id) || []);
  const discoverGroups = allGroups?.filter((g) => !myGroupIds.has(g.id)) || [];

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-fb-text">Grupos</h1>
        <Link href="/groups/create">
          <Button size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Criar grupo
          </Button>
        </Link>
      </div>

      {/* My Groups */}
      <Card className="p-4">
        <h2 className="mb-3 text-lg font-bold text-fb-text">Os meus grupos</h2>
        {!myMemberships || myMemberships.length === 0 ? (
          <p className="text-sm text-fb-text-muted">
            Ainda não pertences a nenhum grupo.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {myMemberships.map((m) => {
              const group = m.groups as unknown as {
                id: string;
                name: string;
                cover_url: string | null;
                description: string | null;
              };
              return (
                <Link
                  key={m.group_id}
                  href={`/groups/${m.group_id}`}
                  className="flex items-center gap-3 rounded-lg border border-fb-border p-3 hover:bg-fb-gray-light"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-fb-blue">
                    {group.cover_url ? (
                      <Image
                        src={group.cover_url}
                        alt={group.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-fb-text">
                      {group.name}
                    </p>
                    <p className="text-xs text-fb-text-muted">{m.role}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Card>

      {/* Discover Groups */}
      {discoverGroups.length > 0 && (
        <Card className="p-4">
          <h2 className="mb-3 text-lg font-bold text-fb-text">
            Descobre grupos
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {discoverGroups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="flex items-center gap-3 rounded-lg border border-fb-border p-3 hover:bg-fb-gray-light"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-fb-blue">
                  {group.cover_url ? (
                    <Image
                      src={group.cover_url}
                      alt={group.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  )}
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
    </div>
  );
}
