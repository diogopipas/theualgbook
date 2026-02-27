import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";

export default async function MessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Get user's conversations
  const { data: participations } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", user.id);

  if (!participations || participations.length === 0) {
    return (
      <div className="py-4">
        <Card className="p-8 text-center">
          <h1 className="mb-2 text-xl font-bold text-fb-text">Mensagens</h1>
          <p className="text-sm text-fb-text-muted">
            Ainda não tens conversas. Envia uma mensagem a alguém!
          </p>
        </Card>
      </div>
    );
  }

  const convIds = participations.map((p) => p.conversation_id);

  // Get conversations with last message and other participant
  const conversations = [];
  for (const convId of convIds) {
    // Get other participant
    const { data: otherParticipant } = await supabase
      .from("conversation_participants")
      .select("user_id, profiles:profiles!user_id(*)")
      .eq("conversation_id", convId)
      .neq("user_id", user.id)
      .single();

    // Get last message
    const { data: lastMessage } = await supabase
      .from("messages")
      .select("content, created_at, sender_id")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (otherParticipant) {
      conversations.push({
        id: convId,
        otherUser: otherParticipant.profiles,
        lastMessage,
      });
    }
  }

  // Sort by last message time
  conversations.sort((a, b) => {
    const aTime = a.lastMessage?.created_at || "";
    const bTime = b.lastMessage?.created_at || "";
    return bTime.localeCompare(aTime);
  });

  return (
    <div className="py-4">
      <Card>
        <div className="border-b border-fb-border px-4 py-3">
          <h1 className="text-lg font-bold text-fb-text">Mensagens</h1>
        </div>
        <div className="divide-y divide-fb-border">
          {conversations.map((conv) => {
            const otherUser = conv.otherUser as unknown as {
              full_name: string;
              username: string;
              avatar_url: string | null;
            };
            return (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-fb-gray-light"
              >
                <Avatar
                  src={otherUser.avatar_url}
                  alt={otherUser.full_name}
                  size="md"
                />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-semibold text-fb-text">
                    {otherUser.full_name}
                  </p>
                  {conv.lastMessage && (
                    <p className="truncate text-xs text-fb-text-muted">
                      {conv.lastMessage.sender_id === user.id ? "Tu: " : ""}
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>
                {conv.lastMessage && (
                  <span className="text-xs text-fb-text-muted">
                    {formatRelativeTime(conv.lastMessage.created_at)}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
