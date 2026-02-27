"use server";

import { createClient } from "@/lib/supabase/server";

export async function searchUsers(query: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
    .limit(20);

  return data || [];
}

export async function searchGroups(query: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("groups")
    .select("*")
    .ilike("name", `%${query}%`)
    .limit(20);

  return data || [];
}

export async function searchPosts(query: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, author:profiles!author_id(*)")
    .ilike("content", `%${query}%`)
    .order("created_at", { ascending: false })
    .limit(20);

  return data || [];
}
