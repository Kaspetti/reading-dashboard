import { fetchUsers } from "@/app/lib/data";
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
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.displayName || user.username}</li>
        ))}
      </ul>
    </div>
  );
}
