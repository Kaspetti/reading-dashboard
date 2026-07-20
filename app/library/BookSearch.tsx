"use client";

import { Input } from "@headlessui/react";
import { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchBooks, Books } from "@/app/lib/actions/books";
import NewBookDialog from "./NewBookDialog";
import BookSearchRow from "./BookSearchRow";

export default function BookSearch({
  ownedBooks,
}: {
  ownedBooks: Set<number>;
}) {
  const [results, setResults] = useState<Books>([]);

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleSearch = useDebouncedCallback(async (query: string) => {
    const books = await searchBooks(query);
    setResults(books);
  }, 200);

  return (
    <div className="flex flex-col w-150">
      <Input
        type="text"
        placeholder="Search books..."
        className="p-2 border"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="border p-2">
        {results.map((book) => (
          <BookSearchRow
            bookTitle={book.title}
            bookId={book.id}
            owned={ownedBooks.has(book.id)}
            key={book.id}
          />
        ))}
        <button
          onClick={() => setIsOpen(true)}
          className="text-gray-500 underline hover:cursor-pointer"
        >
          Add new book...
        </button>
      </div>
      <NewBookDialog
        key={isOpen ? "open" : "closed"}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </div>
  );
}
