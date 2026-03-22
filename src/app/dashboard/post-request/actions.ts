"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { validateRequired, validateMinLength, validateMaxLength } from "@/lib/validation";

export type PostRequestState = {
  error: string | null;
};

export async function postServiceRequest(
  _prev: PostRequestState,
  formData: FormData
): Promise<PostRequestState> {
  const supabase = await createClient();

  // ── Auth check ────────────────────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in to post a request." };

  // ── Role check: only customers may post requests ──────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "customer") {
    return { error: "Only customers can post service requests." };
  }

  // ── Parse form values ─────────────────────────────────────────────────────
  const categoryRaw = formData.get("category_id") as string | null;
  const categoryId =
    categoryRaw && categoryRaw !== ""
      ? parseInt(categoryRaw, 10)
      : null;

  const description = (formData.get("description") as string | null)?.trim() ?? "";
  const location    = (formData.get("location") as string | null)?.trim() ?? "";
  const title       = (formData.get("title") as string | null)?.trim() ?? "";

  // ── Validate required fields ──────────────────────────────────────────────
  const descErr = validateRequired(description, "Description")
    ?? validateMinLength(description, 20, "Description")
    ?? validateMaxLength(description, 1000, "Description");
  const locErr  = validateRequired(location, "Location");

  if (descErr) return { error: descErr };
  if (locErr)  return { error: locErr };
  if (categoryId !== null && isNaN(categoryId)) {
    return { error: "Invalid category selected." };
  }

  // ── Insert into service_requests ──────────────────────────────────────────
  const { error: dbError } = await supabase.from("service_requests").insert({
    customer_id: user.id,
    category_id: categoryId,
    title,
    description,
    location,
    status: "open",
  });

  if (dbError) return { error: dbError.message };

  redirect("/dashboard");
}
