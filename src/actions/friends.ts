"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function sendFriendRequest(addresseeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase.from("friendships").insert({
    requester_id: user.id,
    addressee_id: addresseeId,
    status: "pending",
  });

  if (error) return { error: error.message };

  // Create notification
  await supabase.from("notifications").insert({
    recipient_id: addresseeId,
    actor_id: user.id,
    type: "friend_request",
    entity_type: "friendship",
  });

  revalidatePath("/friends");
  return { success: true };
}

export async function acceptFriendRequest(friendshipId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: friendship } = await supabase
    .from("friendships")
    .select("requester_id")
    .eq("id", friendshipId)
    .eq("addressee_id", user.id)
    .single();

  if (!friendship) return { error: "Pedido não encontrado" };

  await supabase
    .from("friendships")
    .update({ status: "accepted", updated_at: new Date().toISOString() })
    .eq("id", friendshipId);

  // Notify requester
  await supabase.from("notifications").insert({
    recipient_id: friendship.requester_id,
    actor_id: user.id,
    type: "friend_accepted",
    entity_type: "friendship",
  });

  revalidatePath("/friends");
  return { success: true };
}

export async function rejectFriendRequest(friendshipId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  await supabase
    .from("friendships")
    .update({ status: "rejected", updated_at: new Date().toISOString() })
    .eq("id", friendshipId)
    .eq("addressee_id", user.id);

  revalidatePath("/friends");
  return { success: true };
}

export async function unfriend(friendshipId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  await supabase.from("friendships").delete().eq("id", friendshipId);

  revalidatePath("/friends");
  return { success: true };
}
