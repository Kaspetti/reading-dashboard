import { fetchBooks } from "@/app/lib/data";
import LibraryClient from "./LibraryClient";

export default async function Library() {
  const books = await fetchBooks();
  console.log(books);

  return (
    <LibraryClient>
      <div>
        <h1 className="text-2xl font-bold">Books:</h1>
        {books.length > 0 ? (
          <ul>
            {books.map((book) => (
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
