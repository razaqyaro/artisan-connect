"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";
import {
  validateRequired,
  validatePhone,
} from "@/lib/validation";

export type SaveProfileState = {
  error: string | null;
};

export async function saveProfile(
  _prev: SaveProfileState,
  formData: FormData
): Promise<SaveProfileState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to set up a profile." };
  }

  const fullName = (formData.get("full_name") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";
  const roleRaw = formData.get("role") as string | null;
  const location = (formData.get("location") as string | null)?.trim() ?? "";
  const bio = (formData.get("bio") as string | null)?.trim() ?? "";

  const nameErr  = validateRequired(fullName, "Full name");
  const phoneErr = validatePhone(phone);
  const locErr   = validateRequired(location, "Location");
  if (nameErr)  return { error: nameErr };
  if (phoneErr) return { error: phoneErr };
  if (roleRaw !== "customer" && roleRaw !== "service_provider")
    return { error: "Please select a valid role." };
  const role = roleRaw as UserRole;
  if (locErr) return { error: locErr };

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: fullName,
    phone,
    role,
    location,
    bio: bio || null,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
