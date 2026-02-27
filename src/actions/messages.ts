"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getOrCreateConversation(otherUserId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  // Check for existing conversation between these two users
  const { data: myConversations } = await supabase
    .from("conversation_participants")
    .select("conversation_id")
    .eq("user_id", user.id);

  if (myConversations) {
    for (const conv of myConversations) {
      const { data: otherParticipant } = await supabase
        .from("conversation_participants")
        .select("id")
        .eq("conversation_id", conv.conversation_id)
        .eq("user_id", otherUserId)
        .maybeSingle();

      if (otherParticipant) {
        return { conversationId: conv.conversation_id };
      }
    }
  }

  // Create new conversation
  const { data: conversation, error } = await supabase
    .from("conversations")
    .insert({})
    .select("id")
    .single();

  if (error || !conversation) return { error: "Erro ao criar conversa" };

  // Add both participants
  await supabase.from("conversation_participants").insert([
    { conversation_id: conversation.id, user_id: user.id },
    { conversation_id: conversation.id, user_id: otherUserId },
  ]);

  return { conversationId: conversation.id };
}

export async function sendMessage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const conversationId = formData.get("conversationId") as string;
  const content = formData.get("content") as string;

  if (!content?.trim()) return { error: "Mensagem vazia" };

  // Handle optional image
  let imageUrl: string | null = null;
  const image = formData.get("image") as File;
  if (image && image.size > 0) {
    const path = `${conversationId}/${Date.now()}-${image.name}`;
    const { data } = await supabase.storage
      .from("post-images")
      .upload(path, image);
    if (data) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("post-images").getPublicUrl(data.path);
      imageUrl = publicUrl;
    }
  }

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    content: content.trim(),
    image_url: imageUrl,
  });

  if (error) return { error: error.message };

  // Update conversation timestamp
  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  revalidatePath(`/messages/${conversationId}`);
  return { success: true };
}
