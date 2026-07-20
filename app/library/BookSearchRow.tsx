"use client";

import { Button } from "@headlessui/react";
import { addOwnedBook, BookState } from "../lib/actions/books";
import { useActionState } from "react";

export default function BookSearchRow({
  bookTitle,
  bookId,
  owned,
}: {
  bookTitle: string;
  bookId: number;
  owned: boolean;
}) {
  const initialState: BookState = {};
  const addBookWithId = addOwnedBook.bind(null, bookId);
  const [state, formAction, isPending] = useActionState(
    addBookWithId,
    initialState,
  );

  return (
    <div className="flex justify-between border-b p-1">
      {bookTitle}
      <form action={formAction}>
        <Button
          type="submit"
          className="text-gray-500 not-disabled:underline hover:cursor-pointer disabled:cursor-not-allowed"
          disabled={owned || isPending}
        >
          {owned ? "In library" : "Add"}
        </Button>
      </form>
      {state.error && <p className="text-red">{state.error}</p>}
    </div>
  );
}
