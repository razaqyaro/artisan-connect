"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SaveSkillsState = {
  error: string | null;
  success: boolean;
};

export async function saveSkills(
  _prev: SaveSkillsState,
  formData: FormData
): Promise<SaveSkillsState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in.", success: false };
  }

  // Verify the user is actually a service provider
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "service_provider") {
    return { error: "Only service providers can manage skills.", success: false };
  }

  // Parse selected category IDs from checkbox values
  const selectedIds = formData
    .getAll("category_ids")
    .map((v) => parseInt(v as string, 10))
    .filter((n) => !isNaN(n));

  // Delete all existing skills for this provider first (full replace strategy)
  const { error: deleteError } = await supabase
    .from("provider_skills")
    .delete()
    .eq("provider_id", user.id);

  if (deleteError) {
    return { error: deleteError.message, success: false };
  }

  // Insert the newly selected skills (skip if none selected)
  if (selectedIds.length > 0) {
    const rows = selectedIds.map((category_id) => ({
      provider_id: user.id,
      category_id,
    }));

    const { error: insertError } = await supabase
      .from("provider_skills")
      .insert(rows);

    if (insertError) {
      return { error: insertError.message, success: false };
    }
  }

  redirect("/dashboard");
}
