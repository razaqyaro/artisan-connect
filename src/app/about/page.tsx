import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About — Artisan Connect",
  description:
    "Learn about Artisan Connect, Ghana's trusted marketplace connecting customers with skilled local tradespeople.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Sticky nav ─────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Artisan <span className="text-orange-500">Connect</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/about"
              className="text-sm font-medium text-orange-500 px-3 py-2"
            >
              About
            </Link>
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

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-orange-500 to-amber-400 text-white py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              About Artisan Connect
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
              We&apos;re on a mission to make it effortless for Ghanaians to find and
              hire trusted local tradespeople — no middlemen, no hassle.
            </p>
          </div>
        </section>

        {/* ── Mission ──────────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">
                Our Mission
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-snug">
                Bridging the gap between customers and skilled artisans
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Finding a reliable plumber, electrician, or carpenter in Ghana
                has traditionally relied on word-of-mouth — slow, inconsistent,
                and often unavailable when you need it most.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Artisan Connect changes that. We give every skilled tradesperson
                a digital presence and give every customer a simple, fast way to
                discover and contact them directly — right from their phone.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🛠️", label: "Trade Categories", value: "10+" },
                { icon: "👷", label: "Registered Providers", value: "Growing" },
                { icon: "📍", label: "Coverage", value: "Ghana-wide" },
                { icon: "📞", label: "Connection Method", value: "Direct Call" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────────── */}
        <section
          id="how-it-works"
          className="bg-white border-t border-gray-100 py-16 px-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">
                How It Works
              </span>
              <h2 className="text-3xl font-bold text-gray-900">Simple for everyone</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* For customers */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                    🔍
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">For Customers</h3>
                </div>
                <ol className="space-y-5">
                  {[
                    { step: "1", title: "Browse categories", desc: "Pick the trade you need — plumbing, electrical, carpentry and more." },
                    { step: "2", title: "View providers", desc: "See profiles, locations, and bios of available artisans near you." },
                    { step: "3", title: "Call directly", desc: "Tap the Call button to reach the provider instantly from your phone." },
                    { step: "4", title: "Or post a request", desc: "Describe your job and let providers come to you via the job board." },
                  ].map((item) => (
                    <li key={item.step} className="flex gap-4">
                      <span className="flex-shrink-0 w-7 h-7 bg-orange-500 text-white text-sm
                                       font-bold rounded-full flex items-center justify-center">
                        {item.step}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* For providers */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">
                    👷
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">For Artisans</h3>
                </div>
                <ol className="space-y-5">
                  {[
                    { step: "1", title: "Create your account", desc: "Sign up with your email and set up your profile in under 2 minutes." },
                    { step: "2", title: "Select your trades", desc: "Choose all the service categories that match your skills." },
                    { step: "3", title: "Get discovered", desc: "Your profile appears in customer searches immediately — no waiting." },
                    { step: "4", title: "Browse job requests", desc: "View open requests from customers and call them to discuss the job." },
                  ].map((item) => (
                    <li key={item.step} className="flex gap-4">
                      <span className="flex-shrink-0 w-7 h-7 bg-amber-400 text-white text-sm
                                       font-bold rounded-full flex items-center justify-center">
                        {item.step}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ── About the founder ────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">
              The Creator
            </span>
            <h2 className="text-3xl font-bold text-gray-900">Meet the founder</h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col sm:flex-row items-center gap-8">
            {/* Avatar initials */}
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-amber-300
                            flex items-center justify-center text-white text-4xl font-bold
                            flex-shrink-0 shadow-md select-none">
              AR
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-gray-900">
                Abdul-Razak Hussein
              </h3>
              <p className="text-sm text-orange-500 font-medium mt-1">
                Founder &amp; CEO, Artisan Connect · Software Engineer &amp; QA Engineer
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mt-4 max-w-xl">
                I built Artisan Connect to solve a problem I saw every day in Ghana —
                skilled tradespeople with no digital presence, and customers who couldn&apos;t
                find them. As a software and QA engineer, I wanted to build something
                simple, reliable, and phone-first that actually works for real people.
              </p>

              {/* Social links */}
              <div className="flex flex-wrap items-center gap-3 mt-5 justify-center sm:justify-start">
                <a
                  href="https://www.linkedin.com/in/abdul-razak-hussein/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white
                             bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
                <a
                  href="mailto:razaqyaro@gmail.com"
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-700
                             bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors"
                >
                  📧 razaqyaro@gmail.com
                </a>
                <a
                  href="https://wa.me/233599668783"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white
                             bg-green-600 hover:bg-green-500 px-4 py-2 rounded-xl transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section
          id="faq"
          className="bg-white border-t border-gray-100 py-16 px-6"
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">
                FAQ
              </span>
              <h2 className="text-3xl font-bold text-gray-900">
                Frequently asked questions
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Is Artisan Connect free to use?",
                  a: "Yes — browsing categories, viewing providers, and posting service requests are all free for customers. Registering as a service provider is also free.",
                },
                {
                  q: "How do I contact a provider?",
                  a: "Each provider card shows their phone number and a 'Call' button. Tapping it dials them directly from your phone — no in-app messaging needed.",
                },
                {
                  q: "How does my service request reach providers?",
                  a: "When you post a request, it appears on the job board that all registered service providers can see. Providers in the matching category will find it and call you.",
                },
                {
                  q: "How do I appear in search results as a provider?",
                  a: "After signing up, complete your profile and select your trade categories. Your profile will immediately appear when customers browse those categories.",
                },
                {
                  q: "Is my phone number visible to everyone?",
                  a: "For providers, your phone number is visible to any logged-in user browsing your category. For customers, your phone is only visible to logged-in service providers on the job board.",
                },
                {
                  q: "Which areas of Ghana does this cover?",
                  a: "Artisan Connect is open to providers and customers across all of Ghana. Location is shown on each profile so customers can find providers near them.",
                },
              ].map((item) => (
                <details
                  key={item.q}
                  className="group bg-gray-50 rounded-xl border border-gray-200 px-5 py-4
                             open:border-orange-200 open:bg-orange-50 transition-colors"
                >
                  <summary className="flex items-center justify-between cursor-pointer
                                      font-semibold text-gray-900 text-sm select-none list-none">
                    {item.q}
                    <span className="ml-4 flex-shrink-0 text-orange-400 text-lg
                                     group-open:rotate-45 transition-transform duration-200">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Privacy & Terms placeholders ─────────────────────────────────── */}
        <section
          id="privacy"
          className="max-w-3xl mx-auto px-6 py-16 scroll-mt-20"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
          <div className="prose prose-sm prose-gray max-w-none text-gray-600 space-y-3">
            <p>
              Artisan Connect collects only the information necessary to operate
              the platform: your name, email address, phone number, location, and
              the service categories you choose.
            </p>
            <p>
              Your phone number is shared with other registered users for the
              purpose of facilitating direct contact between customers and
              providers. We do not sell your data to third parties.
            </p>
            <p>
              <em>
                A full privacy policy will be published before the official public
                launch. For questions, contact{" "}
                <a href="mailto:razaqyaro@gmail.com" className="text-orange-500 underline">
                  razaqyaro@gmail.com
                </a>.
              </em>
            </p>
          </div>
        </section>

        <section
          id="terms"
          className="max-w-3xl mx-auto px-6 pb-16 scroll-mt-20"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms of Service</h2>
          <div className="prose prose-sm prose-gray max-w-none text-gray-600 space-y-3">
            <p>
              By using Artisan Connect you agree to use the platform in good
              faith — providing accurate information, not impersonating others,
              and not using the contact details of other users for spam or
              harassment.
            </p>
            <p>
              Artisan Connect acts as a directory and communication bridge only.
              We are not a party to any agreement made between customers and
              service providers, and are not liable for the quality or outcome
              of any services rendered.
            </p>
            <p>
              <em>
                Full terms of service will be published before the official public
                launch. For questions, contact{" "}
                <a href="mailto:razaqyaro@gmail.com" className="text-orange-500 underline">
                  razaqyaro@gmail.com
                </a>.
              </em>
            </p>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-orange-500 to-amber-400 py-16 px-6">
          <div className="max-w-xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-3">Ready to get started?</h2>
            <p className="opacity-90 mb-8">
              Join Artisan Connect today — whether you need a tradesperson or
              you are one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="px-8 py-3 bg-white text-orange-500 font-bold rounded-xl
                           hover:bg-orange-50 transition-colors shadow-md text-sm"
              >
                Create an Account
              </Link>
              <Link
                href="/"
                className="px-8 py-3 bg-white/20 text-white font-semibold rounded-xl
                           hover:bg-white/30 transition-colors text-sm"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
