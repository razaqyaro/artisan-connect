import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import RequestForm from "./RequestForm";

export default async function PostRequestPage() {
  const supabase = await createClient();

  // ── Auth ──────────────────────────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // ── Profile & role guard ──────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, location")
    .eq("id", user.id)
    .single();

  if (!profile?.full_name) redirect("/setup-profile");

  // Service providers cannot post requests — send them back to their dashboard
  if (profile.role !== "customer") redirect("/dashboard");

  // ── Fetch categories for the optional dropdown ────────────────────────────
  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name, icon")
    .order("name", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={profile.full_name} userEmail={user.email ?? ""} />

      <main className="max-w-2xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <a href="/dashboard" className="hover:text-orange-500 transition-colors">
            Dashboard
          </a>
          <svg
            className="w-4 h-4 text-gray-400"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 4l4 4-4 4" />
          </svg>
          <span className="text-gray-900 font-medium">Post a Request</span>
        </nav>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Post a Service Request
          </h1>
          <p className="mt-1 text-gray-500 text-sm">
            Describe the job you need done. Providers in your area will see
            your request and can reach out to you.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <RequestForm
            categories={categories ?? []}
            defaultLocation={profile.location ?? ""}
          />
        </div>
      </main>
    </div>
  );
}
