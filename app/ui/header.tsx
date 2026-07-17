import Link from "next/link";
import { logoutUser } from "@/app/lib/actions/auth";
import { SessionUser } from "@/app/lib/session";

export default function Header({ user }: { user: SessionUser }) {
  return (
    <div className="flex justify-between bg-gray-300">
      <div className="flex justify-left">
        <Link href="/" className="pl-5 pr-5 border-1">
          Home
        </Link>
        <Link href="/dashboard" className="pl-5 pr-5 border-1">
          Dashboard
        </Link>
        <Link href="/library" className="pl-5 pr-5 border-1">
          Library
        </Link>
      </div>

      <div className="flex items-center justify-end gap-4">
        {user ? (
          <>
            <div>Logged in as {user.displayName}</div>
            <form action={logoutUser}>
              <button type="submit" className="border-1 p-1">
                Logout
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="pl-5 pr-5 border-1">
              Login
            </Link>
            <Link href="/register" className="pl-5 pr-5 border-1">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
