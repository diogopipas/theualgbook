"use server";

import { createClient } from "@/lib/supabase/server";
import { registerSchema, loginSchema } from "@/lib/validators";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const supabase = await createClient();

  const validated = registerSchema.parse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    course: formData.get("course"),
    courseType: formData.get("courseType"),
  });

  // Double-check email domain server-side
  if (!validated.email.endsWith("@ualg.pt")) {
    return { error: "Apenas emails @ualg.pt são permitidos" };
  }

  const { error } = await supabase.auth.signUp({
    email: validated.email,
    password: validated.password,
    options: {
      data: {
        full_name: validated.fullName,
        course: validated.course,
        course_type: validated.courseType,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/verify-email");
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const validated = loginSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const { error } = await supabase.auth.signInWithPassword({
    email: validated.email,
    password: validated.password,
  });

  if (error) {
    return { error: "Email ou password incorretos" };
  }

  redirect("/feed");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
