import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";

const ROLE_LABEL: Record<string, string> = {
  customer: "Customer",
  service_provider: "Service Provider",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, location, bio")
    .eq("id", user.id)
    .single();

  if (!profile?.full_name) redirect("/setup-profile");

  const isProvider = profile.role === "service_provider";

  // ── Provider stats ───────────────────────────────────────────────────────
  let skillCount = 0;
  let openJobCount = 0;

  if (isProvider) {
    const [skillRes, jobRes] = await Promise.all([
      supabase
        .from("provider_skills")
        .select("id", { count: "exact", head: true })
        .eq("provider_id", user.id),
      supabase
        .from("service_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "open"),
    ]);
    skillCount = skillRes.count ?? 0;
    openJobCount = jobRes.count ?? 0;
  }

  // ── Customer stats ───────────────────────────────────────────────────────
  let openRequestCount = 0;
  let totalRequestCount = 0;
  let totalProviderCount = 0;

  if (!isProvider) {
    const [openRes, totalRes, providerRes] = await Promise.all([
      supabase
        .from("service_requests")
        .select("id", { count: "exact", head: true })
        .eq("customer_id", user.id)
        .eq("status", "open"),
      supabase
        .from("service_requests")
        .select("id", { count: "exact", head: true })
        .eq("customer_id", user.id),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "service_provider"),
    ]);
    openRequestCount = openRes.count ?? 0;
    totalRequestCount = totalRes.count ?? 0;
    totalProviderCount = providerRes.count ?? 0;
  }

  // ── Recent activity ──────────────────────────────────────────────────────
  // Providers: 4 newest open job requests
  // Customers: their 4 most recent service requests
  type ActivityItem = { id: number; title: string; sub: string; time: string };
  let recentActivity: ActivityItem[] = [];

  if (isProvider) {
    const { data: jobs } = await supabase
      .from("service_requests")
      .select("id, title, description, location, created_at, service_categories(name)")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(4);

    recentActivity = (jobs ?? []).map((j) => {
      const catRaw = j.service_categories;
      const catName = Array.isArray(catRaw)
        ? (catRaw[0]?.name ?? "General")
        : (catRaw as { name: string } | null)?.name ?? "General";
      return {
        id: j.id,
        title: j.title || `${catName} request`,
        sub: j.location,
        time: timeAgo(j.created_at),
      };
    });
  } else {
    const { data: myRequests } = await supabase
      .from("service_requests")
      .select("id, title, description, status, created_at, service_categories(name)")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(4);

    recentActivity = (myRequests ?? []).map((r) => {
      const catRaw = r.service_categories;
      const catName = Array.isArray(catRaw)
        ? (catRaw[0]?.name ?? "General")
        : (catRaw as { name: string } | null)?.name ?? "General";
      return {
        id: r.id,
        title: r.title || `${catName} request`,
        sub: r.status === "open" ? "Open" : "Closed",
        time: timeAgo(r.created_at),
      };
    });
  }

  // ── Stats cards ──────────────────────────────────────────────────────────
  const stats = isProvider
    ? [
        { label: "Skills Listed", value: String(skillCount), icon: "🛠️" },
        { label: "Open Jobs Available", value: String(openJobCount), icon: "📋" },
      ]
    : [
        { label: "Open Requests", value: String(openRequestCount), icon: "🔍" },
        { label: "Total Posted", value: String(totalRequestCount), icon: "📝" },
        { label: "Providers Available", value: String(totalProviderCount), icon: "👷" },
      ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={profile.full_name} userEmail={user.email ?? ""} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl p-8 text-white mb-8 shadow-md">
          <p className="text-sm font-medium opacity-80 mb-1">Welcome back 👋</p>
          <h2 className="text-3xl font-bold mb-2">{profile.full_name}</h2>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
              {isProvider ? "👷" : "🛠️"}{" "}
              {ROLE_LABEL[profile.role ?? "customer"]}
            </span>
            {profile.location && (
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                📍 {profile.location}
              </span>
            )}
          </div>
          {profile.bio && (
            <p className="mt-3 text-sm opacity-80 max-w-lg">{profile.bio}</p>
          )}
        </div>

        {/* Stats grid */}
        <div className={`grid gap-4 mb-8 ${stats.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Customer quick-actions */}
        {!isProvider && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Customer Tools</h3>
            <p className="text-sm text-gray-500 mb-5">
              Find the right artisan for your next project.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/dashboard/post-request"
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-colors group"
              >
                <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center text-xl group-hover:bg-orange-200 transition-colors flex-shrink-0">
                  📝
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Post a Request</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {openRequestCount > 0
                      ? `${openRequestCount} open request${openRequestCount !== 1 ? "s" : ""} — post another`
                      : "Describe your job and find the right artisan"}
                  </p>
                </div>
                <span className="ml-auto text-orange-400 text-lg">→</span>
              </Link>

              <Link
                href="/"
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors group"
              >
                <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center text-xl group-hover:bg-orange-100 transition-colors flex-shrink-0">
                  🔍
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Browse Providers</p>
                  <p className="text-xs text-gray-500 mt-0.5">Search by trade category</p>
                </div>
                <span className="ml-auto text-orange-400 text-lg">→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Provider quick-actions */}
        {isProvider && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Provider Tools</h3>
            <p className="text-sm text-gray-500 mb-5">
              Keep your profile complete to attract more clients.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/dashboard/skills"
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-colors group"
              >
                <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center text-xl group-hover:bg-orange-200 transition-colors flex-shrink-0">
                  🛠️
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Manage Skills</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {skillCount > 0
                      ? `${skillCount} skill${skillCount !== 1 ? "s" : ""} selected — update anytime`
                      : "Add your trade categories to get discovered"}
                  </p>
                </div>
                <span className="ml-auto text-orange-400 text-lg">→</span>
              </Link>

              <Link
                href="/dashboard/jobs"
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors group"
              >
                <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center text-xl group-hover:bg-orange-100 transition-colors flex-shrink-0">
                  📋
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Browse Jobs</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {openJobCount > 0
                      ? `${openJobCount} open request${openJobCount !== 1 ? "s" : ""} waiting`
                      : "View open customer requests"}
                  </p>
                </div>
                <span className="ml-auto text-orange-400 text-lg">→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Recent activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-gray-900">
              {isProvider ? "Latest Job Requests" : "Your Recent Requests"}
            </h3>
            <Link
              href={isProvider ? "/dashboard/jobs" : "/dashboard/post-request"}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              {isProvider ? "View all →" : "Post new →"}
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-3xl mb-3">{isProvider ? "📋" : "📝"}</p>
              <p className="text-sm text-gray-500">
                {isProvider
                  ? "No open job requests yet. Check back soon."
                  : "You haven't posted any requests yet."}
              </p>
              {!isProvider && (
                <Link
                  href="/dashboard/post-request"
                  className="inline-block mt-4 px-5 py-2 bg-orange-500 text-white text-sm
                             font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                >
                  Post your first request
                </Link>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentActivity.map((item) => (
                <li key={item.id} className="py-4 flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
