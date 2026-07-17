import { fetchUsers } from "@/app/lib/data";

export default async function Home() {
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
