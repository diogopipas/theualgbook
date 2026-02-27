import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ChatView } from "@/components/messages/chat-view";

interface ChatPageProps {
  params: Promise<{ conversationId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { conversationId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Verify participation
  const { data: participation } = await supabase
    .from("conversation_participants")
    .select("id")
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!participation) notFound();

  // Get other participant
  const { data: otherParticipant } = await supabase
    .from("conversation_participants")
    .select("profiles:profiles!user_id(*)")
    .eq("conversation_id", conversationId)
    .neq("user_id", user.id)
    .single();

  // Get messages
  const { data: messages } = await supabase
    .from("messages")
    .select("*, sender:profiles!sender_id(*)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  const otherUser = otherParticipant?.profiles as unknown as {
    full_name: string;
    username: string;
    avatar_url: string | null;
  };

  return (
    <div className="py-4">
      <ChatView
        conversationId={conversationId}
        currentUserId={user.id}
        otherUser={otherUser}
        initialMessages={messages || []}
      />
    </div>
  );
}
