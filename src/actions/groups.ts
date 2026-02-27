"use server";

import { createClient } from "@/lib/supabase/server";
import { groupSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGroup(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const validated = groupSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    privacy: formData.get("privacy") || "public",
  });

  // Handle cover image
  let coverUrl: string | null = null;
  const cover = formData.get("cover") as File;
  if (cover && cover.size > 0) {
    const path = `groups/${Date.now()}-${cover.name}`;
    const { data } = await supabase.storage.from("covers").upload(path, cover);
    if (data) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("covers").getPublicUrl(data.path);
      coverUrl = publicUrl;
    }
  }

  const { data: group, error } = await supabase
    .from("groups")
    .insert({
      name: validated.name,
      description: validated.description,
      privacy: validated.privacy,
      cover_url: coverUrl,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  // Add creator as admin
  await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: user.id,
    role: "admin",
  });

  redirect(`/groups/${group.id}`);
}

export async function joinGroup(groupId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase.from("group_members").insert({
    group_id: groupId,
    user_id: user.id,
    role: "member",
  });

  if (error) return { error: error.message };
  revalidatePath(`/groups/${groupId}`);
  return { success: true };
}

export async function leaveGroup(groupId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", user.id);

  revalidatePath(`/groups/${groupId}`);
  return { success: true };
}
