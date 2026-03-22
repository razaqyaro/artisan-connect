import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import SkillsForm from "./SkillsForm";

export default async function SkillsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verify identity and role
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile?.full_name) redirect("/setup-profile");

  // Only service providers can access this page
  if (profile.role !== "service_provider") redirect("/dashboard");

  // Fetch all available service categories
  const { data: categories, error: catError } = await supabase
    .from("service_categories")
    .select("id, name, description, icon, created_at")
    .order("name", { ascending: true });

  if (catError || !categories) {
    throw new Error("Failed to load service categories.");
  }

  // Fetch provider's currently saved skills
  const { data: existingSkills } = await supabase
    .from("provider_skills")
    .select("category_id")
    .eq("provider_id", user.id);

  const selectedIds = (existingSkills ?? []).map((s) => s.category_id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={profile.full_name} userEmail={user.email ?? ""} />

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Manage Your Skills</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Select the trade categories you offer. Clients search by category,
            so tick everything that applies to you.
          </p>
        </div>

        {/* Selection hint */}
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-6">
          <span className="text-xl">💡</span>
          <p className="text-sm text-orange-800">
            <span className="font-semibold">
              {selectedIds.length} of {categories.length}
            </span>{" "}
            skill{selectedIds.length !== 1 ? "s" : ""} currently selected.
            Your changes will replace the full list when you save.
          </p>
        </div>

        {/* The form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <SkillsForm categories={categories} selectedIds={selectedIds} />
        </div>
      </main>
    </div>
  );
}
