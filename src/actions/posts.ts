"use server";

import { createClient } from "@/lib/supabase/server";
import { postSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const validated = postSchema.parse({
    content: formData.get("content"),
    visibility: formData.get("visibility") || "friends",
    groupId: formData.get("groupId") || null,
  });

  // Handle image uploads
  const images = formData.getAll("images") as File[];
  const imageUrls: string[] = [];

  for (const image of images) {
    if (image.size === 0) continue;
    const path = `${user.id}/${Date.now()}-${image.name}`;
    const { data } = await supabase.storage
      .from("post-images")
      .upload(path, image);
    if (data) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("post-images").getPublicUrl(data.path);
      imageUrls.push(publicUrl);
    }
  }

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    content: validated.content,
    visibility: validated.visibility,
    group_id: validated.groupId,
    image_urls: imageUrls,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/feed");
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/feed");
}
