import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { markAllAsRead } from "@/actions/notifications";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

const notificationText: Record<string, string> = {
  friend_request: "enviou-te um pedido de amizade",
  friend_accepted: "aceitou o teu pedido de amizade",
  post_reaction: "reagiu ao teu post",
  comment: "comentou no teu post",
  comment_reaction: "reagiu ao teu comentário",
  group_invite: "convidou-te para um grupo",
  group_post: "publicou no grupo",
  message: "enviou-te uma mensagem",
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*, actor:profiles!actor_id(*)")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="py-4">
      <Card>
        <div className="flex items-center justify-between border-b border-fb-border px-4 py-3">
          <h1 className="text-lg font-bold text-fb-text">Notificações</h1>
          <form action={markAllAsRead}>
            <Button type="submit" variant="ghost" size="sm">
              Marcar todas como lidas
            </Button>
          </form>
        </div>

        {!notifications || notifications.length === 0 ? (
          <p className="p-8 text-center text-sm text-fb-text-muted">
            Sem notificações
          </p>
        ) : (
          <div className="divide-y divide-fb-border">
            {notifications.map((notif) => {
              const actor = notif.actor as {
                full_name: string;
                username: string;
                avatar_url: string | null;
              };
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 px-4 py-3 ${
                    !notif.is_read ? "bg-fb-blue/5" : ""
                  }`}
                >
                  <Link href={`/profile/${actor.username}`}>
                    <Avatar
                      src={actor.avatar_url}
                      alt={actor.full_name}
                      size="md"
                    />
                  </Link>
                  <div className="flex-1">
                    <p className="text-sm text-fb-text">
                      <Link
                        href={`/profile/${actor.username}`}
                        className="font-semibold hover:underline"
                      >
                        {actor.full_name}
                      </Link>{" "}
                      {notificationText[notif.type] || notif.type}
                    </p>
                    <p className="text-xs text-fb-text-muted">
                      {formatRelativeTime(notif.created_at)}
                    </p>
                  </div>
                  {!notif.is_read && (
                    <div className="mt-2 h-2.5 w-2.5 rounded-full bg-fb-blue" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
