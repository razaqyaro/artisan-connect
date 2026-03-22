import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";

const ROLE_LABEL: Record<string, string> = {
  customer: "Customer",
  service_provider: "Service Provider",
};

const recentActivity = [
  { id: 1, title: "New message from Sarah K.", time: "2 hours ago" },
  { id: 2, title: "Your proposal was accepted", time: "Yesterday" },
  { id: 3, title: 'Job posted: "Plumbing repair in Accra"', time: "2 days ago" },
  { id: 4, title: "Payment received — GHS 450", time: "3 days ago" },
];

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

  // For providers, also fetch their current skill count
  let skillCount = 0;
  if (profile.role === "service_provider") {
    const { count } = await supabase
      .from("provider_skills")
      .select("id", { count: "exact", head: true })
      .eq("provider_id", user.id);
    skillCount = count ?? 0;
  }

  // For customers, fetch their open request count
  let openRequestCount = 0;
  if (profile.role === "customer") {
    const { count } = await supabase
      .from("service_requests")
      .select("id", { count: "exact", head: true })
      .eq("customer_id", user.id)
      .eq("status", "open");
    openRequestCount = count ?? 0;
  }

  const stats =
    profile.role === "service_provider"
      ? [
          { label: "Skills Listed", value: String(skillCount), icon: "🛠️" },
          { label: "Proposals Sent", value: "12", icon: "📄" },
          { label: "Completed Jobs", value: "27", icon: "✅" },
          { label: "Profile Views", value: "148", icon: "👁️" },
        ]
      : [
          { label: "Open Requests", value: String(openRequestCount), icon: "🔍" },
          { label: "In Progress", value: "1", icon: "🔨" },
          { label: "Completed", value: "14", icon: "✅" },
          { label: "Total Spent", value: "GHS 2,400", icon: "💰" },
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
              {profile.role === "service_provider" ? "👷" : "🛠️"}{" "}
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Customer quick-actions */}
        {profile.role === "customer" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Customer Tools
            </h3>
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
                  <p className="font-semibold text-gray-800 text-sm">
                    Post a Request
                  </p>
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
                  <p className="font-semibold text-gray-800 text-sm">
                    Browse Providers
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Search by trade category
                  </p>
                </div>
                <span className="ml-auto text-orange-400 text-lg">→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Provider quick-actions */}
        {profile.role === "service_provider" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Provider Tools
            </h3>
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
                  <p className="font-semibold text-gray-800 text-sm">
                    Manage Skills
                  </p>
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
                  <p className="font-semibold text-gray-800 text-sm">
                    Browse Jobs
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    View open customer requests
                  </p>
                </div>
                <span className="ml-auto text-orange-400 text-lg">→</span>
              </Link>
            </div>
          </div>
        )}

        {/* Recent activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">
            Recent Activity
          </h3>
          <ul className="divide-y divide-gray-100">
            {recentActivity.map((item) => (
              <li key={item.id} className="py-4 flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
