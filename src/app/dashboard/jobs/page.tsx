import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import JobBoard, { type JobRequest } from "./JobBoard";

export default async function JobsPage() {
  const supabase = await createClient();

  // ── Auth ──────────────────────────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // ── Profile & role guard ──────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (!profile?.full_name) redirect("/setup-profile");
  if (profile.role !== "service_provider") redirect("/dashboard");

  // ── Fetch all open service requests, newest first ─────────────────────────
  // Joins:
  //   service_categories  → category badge (icon + name)
  //   profiles            → customer phone number for "Call Customer"
  const { data: requestRows, error: reqError } = await supabase
    .from("service_requests")
    .select(
      "id, title, description, location, created_at, service_categories(id, name, icon), profiles(phone)"
    )
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (reqError) {
    throw new Error("Failed to load service requests.");
  }

  // Normalise the joined shape to match the JobRequest type
  const jobs: JobRequest[] = (requestRows ?? []).map((row) => {
    const catRaw = row.service_categories;
    const profileRaw = row.profiles;

    return {
      id:          row.id,
      title:       row.title,
      description: row.description,
      location:    row.location,
      created_at:  row.created_at,
      service_categories: Array.isArray(catRaw)
        ? (catRaw[0] ?? null)
        : catRaw,
      customerPhone: Array.isArray(profileRaw)
        ? (profileRaw[0]?.phone ?? null)
        : (profileRaw as { phone: string | null } | null)?.phone ?? null,
    };
  });

  // ── Fetch this provider's skill category IDs (for the filter toggle) ──────
  const { data: skillRows } = await supabase
    .from("provider_skills")
    .select("category_id")
    .eq("provider_id", user.id);

  const providerSkillIds = (skillRows ?? []).map((s) => s.category_id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={profile.full_name} userEmail={user.email ?? ""} />

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* ── Breadcrumb ────────────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/dashboard" className="hover:text-orange-500 transition-colors">
            Dashboard
          </Link>
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
          <span className="text-gray-900 font-medium">Browse Jobs</span>
        </nav>

        {/* ── Page header ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Open Job Requests</h1>
            <p className="mt-1 text-sm text-gray-500">
              {jobs.length === 0
                ? "No open requests at the moment — check back soon."
                : `${jobs.length} open request${jobs.length !== 1 ? "s" : ""} from customers`}
            </p>
          </div>

          {/* Skills shortcut */}
          {providerSkillIds.length === 0 && (
            <Link
              href="/dashboard/skills"
              className="inline-flex items-center gap-2 text-xs font-semibold text-orange-600
                         bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg
                         hover:bg-orange-100 transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              🛠️ Add your skills to filter jobs →
            </Link>
          )}
        </div>

        {/* ── Job board ─────────────────────────────────────────────────── */}
        <JobBoard jobs={jobs} providerSkillIds={providerSkillIds} />
      </main>
    </div>
  );
}
