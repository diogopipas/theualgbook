"use server";

import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const validated = profileSchema.parse({
    fullName: formData.get("fullName"),
    username: formData.get("username"),
    bio: formData.get("bio") || undefined,
    course: formData.get("course") || undefined,
    courseType: formData.get("courseType") || null,
    department: formData.get("department") || undefined,
    enrollmentYear: formData.get("enrollmentYear")
      ? Number(formData.get("enrollmentYear"))
      : null,
  });

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: validated.fullName,
      username: validated.username,
      bio: validated.bio,
      course: validated.course,
      course_type: validated.courseType,
      department: validated.department,
      enrollment_year: validated.enrollmentYear,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Este username já está em uso" };
    }
    return { error: error.message };
  }

  revalidatePath(`/profile/${validated.username}`);
  return { success: true };
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const file = formData.get("avatar") as File;
  if (!file || file.size === 0) return { error: "Nenhum ficheiro selecionado" };

  const path = `${user.id}/avatar-${Date.now()}`;
  const { data, error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(data.path);

  await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  revalidatePath("/");
  return { success: true, url: publicUrl };
}

export async function uploadCover(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const file = formData.get("cover") as File;
  if (!file || file.size === 0) return { error: "Nenhum ficheiro selecionado" };

  const path = `${user.id}/cover-${Date.now()}`;
  const { data, error: uploadError } = await supabase.storage
    .from("covers")
    .upload(path, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("covers").getPublicUrl(data.path);

  await supabase
    .from("profiles")
    .update({ cover_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  revalidatePath("/");
  return { success: true, url: publicUrl };
}
