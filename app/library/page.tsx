import LibraryClient from "./LibraryClient";
import { getUserBookEntries } from "../lib/actions/books";
import OwnedBookRow from "./OwnedBookRow";
import { bookDisplayFields } from "@/app/lib/books";

export default async function Library() {
  const ownedBooks = await getUserBookEntries();
  ownedBooks.sort((a, b) =>
    bookDisplayFields(a).title.localeCompare(bookDisplayFields(b).title),
  );

  return (
    <LibraryClient ownedBooks={new Set(ownedBooks.map((o) => o.id))}>
      <div>
        <h1 className="text-2xl font-bold">Owned Books:</h1>
        {ownedBooks.length > 0 ? (
          <div>
            {ownedBooks.map((book) => (
              <OwnedBookRow book={book} key={book.id} />
            ))}
          </div>
        ) : (
          <p>No books yet.</p>
        )}
      </div>
    </LibraryClient>
  );
}
