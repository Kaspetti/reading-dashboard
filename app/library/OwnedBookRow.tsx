"use client";

import { Button } from "@headlessui/react";
import { BookState, OwnedBook, removeOwnedBook } from "@/app/lib/actions/books";
import { useActionState } from "react";

export default function OwnedBookRow({ book }: { book: OwnedBook }) {
  const initialState: BookState = {};
  const removeBookById = removeOwnedBook.bind(null, book.id);
  const [state, formAction, isPending] = useActionState(
    removeBookById,
    initialState,
  );

  return (
    <div className="flex justify-between w-150">
      <div>
        {book.title}
        {!book.verified && !book.isbn && (
          <span className="text-gray-500"> unverified</span>
        )}
        {!book.verified && book.isbn && (
          <span className="text-gray-500"> verification pending</span>
        )}
      </div>
      <form action={formAction}>
        <Button
          type="submit"
          className="text-gray-500 underline hover:cursor-pointer"
          disabled={isPending}
        >
          Remove
        </Button>
      </form>
      {state.error && <p className="text-red">{state.error}</p>}
    </div>
  );
}
