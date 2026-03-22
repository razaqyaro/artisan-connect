import Link from "next/link";
import SignOutButton from "./SignOutButton";

interface NavbarProps {
  userName: string;
  userEmail: string;
}

export default function Navbar({ userName, userEmail }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/dashboard">
          <h1 className="text-xl font-bold text-gray-900 cursor-pointer">
            Artisan <span className="text-orange-500">Connect</span>
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-700">{userName}</span>
            <span className="text-xs text-gray-400">{userEmail}</span>
          </div>
          <SignOutButton />
        </div>
      </div>
    </nav>
  );
}
