import { fetchUsers } from "@/app/lib/data";
import Link from "next/link";
import { getCurrentUser } from "./lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const users = await fetchUsers();

  return (
    <div>
      <Link href="/register" className="pl-5 pr-5 border-1">
        Register
      </Link>
      <Link href="/login" className="pl-5 pr-5 border-1">
        Login
      </Link>

      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.displayName || user.username}</li>
        ))}
      </ul>
    </div>
  );
}
