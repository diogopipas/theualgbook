"use server";

import { createClient } from "@/lib/supabase/server";
import type { ReactionType } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function toggleReaction(
  targetId: string,
  targetType: "post" | "comment",
  reactionType: ReactionType
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const column = targetType === "post" ? "post_id" : "comment_id";

  // Check if reaction exists
  const { data: existing } = await supabase
    .from("reactions")
    .select("id, type")
    .eq("user_id", user.id)
    .eq(column, targetId)
    .maybeSingle();

  if (existing) {
    if (existing.type === reactionType) {
      // Remove reaction
      await supabase.from("reactions").delete().eq("id", existing.id);
    } else {
      // Update reaction type
      await supabase
        .from("reactions")
        .update({ type: reactionType })
        .eq("id", existing.id);
    }
  } else {
    // Create new reaction
    const insertData: Record<string, string> = {
      user_id: user.id,
      type: reactionType,
    };
    insertData[column] = targetId;

    await supabase.from("reactions").insert(insertData);

    // Create notification
    if (targetType === "post") {
      const { data: post } = await supabase
        .from("posts")
        .select("author_id")
        .eq("id", targetId)
        .single();

      if (post && post.author_id !== user.id) {
        await supabase.from("notifications").insert({
          recipient_id: post.author_id,
          actor_id: user.id,
          type: "post_reaction",
          entity_id: targetId,
          entity_type: "post",
        });
      }
    }
  }

  revalidatePath("/feed");
}
