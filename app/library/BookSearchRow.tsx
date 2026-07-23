"use client";

import { Button } from "@headlessui/react";
import { addOwnedBook, BookSearch, BookState } from "../lib/actions/books";
import { useActionState } from "react";

export default function BookSearchRow({
  book,
  owned,
}: {
  book: BookSearch;
  owned: boolean;
}) {
  const initialState: BookState = {};
  const addBookWithId = addOwnedBook.bind(null, book.id);
  const [state, formAction, isPending] = useActionState(
    addBookWithId,
    initialState,
  );

  return (
    <div className="flex justify-between border-b p-1">
      <div>{book.title}</div>
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
