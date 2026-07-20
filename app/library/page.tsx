import LibraryClient from "./LibraryClient";
import { getOwnedBooks } from "../lib/actions/books";

export default async function Library() {
  const ownedBooks = await getOwnedBooks();

  return (
    <LibraryClient ownedBooks={new Set(ownedBooks.map((o) => o.id))}>
      <div>
        <h1 className="text-2xl font-bold">Owned Books:</h1>
        {ownedBooks.length > 0 ? (
          <ul>
            {ownedBooks.map((book) => (
              <li key={book.id}>
                {book.title} by {book.author} ({book.pages}p.)
              </li>
            ))}
          </ul>
        ) : (
          <p>No books yet.</p>
        )}
      </div>
    </LibraryClient>
  );
}
