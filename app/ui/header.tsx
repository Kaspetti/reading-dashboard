import Link from "next/link";
import { logoutUser } from "../lib/actions";
import { SessionUser } from "../lib/session";

export default function Header({ user }: { user: SessionUser }) {
  return (
    <div className="flex items-center justify-end gap-4 bg-gray-300">
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
  );
}
