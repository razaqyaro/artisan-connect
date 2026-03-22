# Artisan Connect

A full-stack web app built with **Next.js 16 (App Router)**, **Supabase**, and **Tailwind CSS** for connecting clients with skilled local artisans.

---

## Features

- Email + password authentication (powered by Supabase Auth)
- Protected routes via Next.js Middleware
- Login, Signup, and Dashboard pages
- Server-side auth checks with the `@supabase/ssr` package
- Tailwind CSS styling

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/               # Route group — shared auth layout
│   │   ├── login/page.tsx    # Login page
│   │   └── signup/page.tsx   # Signup page
│   ├── dashboard/page.tsx    # Protected dashboard (Server Component)
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css
├── components/
│   └── SignOutButton.tsx      # Client component for sign-out
├── lib/
│   └── supabase/
│       ├── client.ts         # Browser Supabase client
│       └── server.ts         # Server Supabase client (RSC / Server Actions)
└── middleware.ts             # Route protection & auth redirects
```

---

## Getting Started

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a new project, and grab your **Project URL** and **Anon Key** from:

> Settings → API

### 2. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Auth Flow

| Route        | Behaviour                                          |
|--------------|----------------------------------------------------|
| `/`          | Public landing page                                |
| `/signup`    | Create account; redirects to `/dashboard` if logged in |
| `/login`     | Sign in; redirects to `/dashboard` if logged in   |
| `/dashboard` | Protected; redirects to `/login` if not authenticated |

The middleware in `src/middleware.ts` handles all redirects on the server before the page renders.
