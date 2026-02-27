"use server";

import { createClient } from "@/lib/supabase/server";
import { commentSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function createComment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const validated = commentSchema.parse({
    content: formData.get("content"),
    postId: formData.get("postId"),
    parentId: formData.get("parentId") || null,
  });

  const { error } = await supabase.from("comments").insert({
    post_id: validated.postId,
    author_id: user.id,
    parent_id: validated.parentId,
    content: validated.content,
  });

  if (error) throw new Error(error.message);

  // Create notification for post author
  const { data: post } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", validated.postId)
    .single();

  if (post && post.author_id !== user.id) {
    await supabase.from("notifications").insert({
      recipient_id: post.author_id,
      actor_id: user.id,
      type: "comment",
      entity_id: validated.postId,
      entity_type: "post",
    });
  }

  revalidatePath("/feed");
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("author_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/feed");
}
