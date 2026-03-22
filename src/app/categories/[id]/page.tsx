import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
};

type Provider = {
  id: string;
  full_name: string;
  location: string | null;
  bio: string | null;
  phone: string | null;
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function CategoryPage({ params }: PageProps) {
  const { id } = await params;
  const categoryId = parseInt(id, 10);
  if (isNaN(categoryId)) notFound();

  const supabase = await createClient();

  // ── 1. Fetch the requested category from service_categories ──────────────
  const { data: category } = await supabase
    .from("service_categories")
    .select("id, name, description, icon")
    .eq("id", categoryId)
    .single();

  if (!category) notFound();

  // ── 2. Join provider_skills → profiles to get providers for this category
  //       provider_skills links profiles and service_categories many-to-many.
  //       We resolve the provider_id list first, then fetch full profiles with
  //       an explicit role = 'service_provider' guard.
  // ─────────────────────────────────────────────────────────────────────────

  // Step A: get every provider_id that has registered this category skill
  const { data: skillRows } = await supabase
    .from("provider_skills")
    .select("provider_id")
    .eq("category_id", categoryId);

  const providerIds = (skillRows ?? []).map((r) => r.provider_id);

  // Step B: fetch full profiles for those IDs, explicitly restricted to
  //         role = 'service_provider' so customers can never appear
  let providers: Provider[] = [];
  if (providerIds.length > 0) {
    const { data: profileRows } = await supabase
      .from("profiles")
      .select("id, full_name, location, bio, phone")
      .in("id", providerIds)
      .eq("role", "service_provider")
      .order("full_name", { ascending: true });

    providers = profileRows ?? [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Sticky nav ─────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Artisan <span className="text-orange-500">Connect</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-orange-500 text-white px-4 py-2 rounded-xl
                         hover:bg-orange-600 transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
        <nav
          className="flex items-center gap-2 text-sm text-gray-500 mb-8"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-orange-500 transition-colors">
            Home
          </Link>
          <ChevronIcon />
          <span className="text-gray-900 font-medium">{category.name}</span>
        </nav>

        {/* ── Category header banner ───────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl p-8 text-white mb-10 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
              {category.icon ?? "🔧"}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-extrabold">{category.name}</h1>
              {category.description && (
                <p className="mt-1 opacity-85 text-sm max-w-xl">
                  {category.description}
                </p>
              )}
            </div>
            {/* Provider count pill */}
            <div className="flex-shrink-0">
              <span className="inline-flex items-center gap-2 bg-white/20 text-white font-semibold text-sm px-4 py-2 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                {providers.length} provider{providers.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* ── Provider listing ─────────────────────────────────────────────── */}
        {providers.length === 0 ? (
          <EmptyState categoryName={category.name} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Available Providers
              </h2>
              <span className="text-sm text-gray-500">
                {providers.length} result{providers.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {providers.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ─── Provider card ────────────────────────────────────────────────────────────

function ProviderCard({ provider }: { provider: Provider }) {
  const initials = provider.full_name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col
                        hover:shadow-md hover:border-orange-200 transition-all duration-200">
      {/* ── Card top ── */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        {/* Avatar + name + location */}
        <div className="flex items-start gap-4">
          <div
            className="w-13 h-13 w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-300
                       flex items-center justify-center text-white font-bold text-lg
                       flex-shrink-0 select-none shadow-sm"
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 truncate text-base leading-snug">
              {provider.full_name}
            </h3>
            {provider.location ? (
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <LocationIcon />
                <span className="truncate">{provider.location}</span>
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-0.5">Location not set</p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="flex-1">
          {provider.bio ? (
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {provider.bio}
            </p>
          ) : (
            <p className="text-sm text-gray-400 italic">No bio provided.</p>
          )}
        </div>
      </div>

      {/* ── Contact strip ── */}
      <div className="border-t border-gray-100 px-6 py-4 flex flex-col gap-3">
        {provider.phone ? (
          <>
            {/* Phone number display row */}
            <div className="flex items-center gap-2 text-gray-500">
              <PhoneIcon className="text-gray-400 flex-shrink-0" />
              <span className="text-sm tabular-nums tracking-wide">
                {provider.phone}
              </span>
            </div>

            {/* Call button — tel: href triggers native dialler on mobile */}
            <a
              href={`tel:${provider.phone}`}
              aria-label={`Call ${provider.full_name} at ${provider.phone}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                         bg-green-500 hover:bg-green-600 active:bg-green-700
                         text-white text-sm font-semibold
                         transition-colors shadow-sm select-none"
            >
              <PhoneIcon className="text-white" />
              Call {provider.full_name.split(" ")[0]}
            </a>
          </>
        ) : (
          /* No phone — greyed out state */
          <div className="flex items-center gap-2 py-1">
            <PhoneIcon className="text-gray-300 flex-shrink-0" />
            <span className="text-sm text-gray-400 italic">
              Phone not provided
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ categoryName }: { categoryName: string }) {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="text-5xl mb-4">👷</div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        No providers yet for {categoryName}
      </h3>
      <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
        Be the first! Create a service provider account and list this trade as
        one of your skills.
      </p>
      <Link
        href="/signup"
        className="inline-block px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl
                   hover:bg-orange-600 transition-colors shadow-sm text-sm"
      >
        Join as a Provider
      </Link>
    </div>
  );
}

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

function ChevronIcon() {
  return (
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
  );
}

function LocationIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 1.5A4.5 4.5 0 0 1 12.5 6c0 3.5-4.5 8.5-4.5 8.5S3.5 9.5 3.5 6A4.5 4.5 0 0 1 8 1.5Z" />
      <circle cx="8" cy="6" r="1.5" />
    </svg>
  );
}

function PhoneIcon({ className = "text-orange-500" }: { className?: string }) {
  return (
    <svg
      className={`w-4 h-4 ${className}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 2.5C2 2.5 3 1 4.5 1c.5 0 1 .5 1.5 1.5l1 2c.3.7.1 1.3-.3 1.8L5.5 7.5C6.3 9 7 9.7 8.5 10.5l1.2-1.2c.5-.4 1.1-.6 1.8-.3l2 1c1 .5 1.5 1 1.5 1.5 0 1.5-1.5 2.5-1.5 2.5C5 16 0 11 0 4.5 0 4.5 .5 3 2 2.5Z" />
    </svg>
  );
}
