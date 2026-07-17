"use client";

import { Input } from "@headlessui/react";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { searchBooks, Books } from "@/app/lib/actions/books";

export default function BookSearch() {
  const [results, setResults] = useState<Books>([]);

  const handleSearch = useDebouncedCallback(async (query: string) => {
    const books = await searchBooks(query);
    setResults(books);
    console.log(books);
  }, 200);

  return (
    <div>
      <Input
        type="text"
        placeholder="Search books..."
        className="p-2"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div>
        {results.map((book) => (
          <li key={book.id}>
            {book.title} | {book.similarity}
          </li>
        ))}
      </div>
    </div>
  );
}
