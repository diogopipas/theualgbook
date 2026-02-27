import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { FriendActions } from "@/components/friends/friend-actions";
import Link from "next/link";

export default async function FriendsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Get pending requests
  const { data: pendingRequests } = await supabase
    .from("friendships")
    .select("*, requester:profiles!requester_id(*)")
    .eq("addressee_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  // Get accepted friends
  const { data: friendships } = await supabase
    .from("friendships")
    .select(
      "*, requester:profiles!requester_id(*), addressee:profiles!addressee_id(*)"
    )
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .eq("status", "accepted")
    .order("updated_at", { ascending: false });

  const friends = friendships?.map((f) =>
    f.requester_id === user.id
      ? { ...f, friend: f.addressee }
      : { ...f, friend: f.requester }
  );

  return (
    <div className="space-y-4 py-4">
      {/* Pending Requests */}
      {pendingRequests && pendingRequests.length > 0 && (
        <Card className="p-4">
          <h2 className="mb-3 text-lg font-bold text-fb-text">
            Pedidos de amizade
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center gap-3 rounded-lg border border-fb-border p-3"
              >
                <Link href={`/profile/${request.requester.username}`}>
                  <Avatar
                    src={request.requester.avatar_url}
                    alt={request.requester.full_name}
                    size="lg"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    href={`/profile/${request.requester.username}`}
                    className="text-sm font-semibold text-fb-text hover:underline"
                  >
                    {request.requester.full_name}
                  </Link>
                  {request.requester.course && (
                    <p className="text-xs text-fb-text-muted">
                      {request.requester.course}
                    </p>
                  )}
                  <FriendActions friendshipId={request.id} type="request" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Friends list */}
      <Card className="p-4">
        <h2 className="mb-3 text-lg font-bold text-fb-text">
          Amigos {friends ? `(${friends.length})` : ""}
        </h2>
        {!friends || friends.length === 0 ? (
          <p className="text-sm text-fb-text-muted">
            Ainda não tens amigos. Começa por pesquisar pessoas!
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {friends.map((f) => (
              <Link
                key={f.id}
                href={`/profile/${f.friend.username}`}
                className="flex items-center gap-3 rounded-lg border border-fb-border p-3 hover:bg-fb-gray-light"
              >
                <Avatar
                  src={f.friend.avatar_url}
                  alt={f.friend.full_name}
                  size="md"
                />
                <div>
                  <p className="text-sm font-semibold text-fb-text">
                    {f.friend.full_name}
                  </p>
                  {f.friend.course && (
                    <p className="text-xs text-fb-text-muted">
                      {f.friend.course}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
