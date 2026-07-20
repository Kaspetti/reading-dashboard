"use client";

import { Button } from "@headlessui/react";
import { Book, BookState, removeOwnedBook } from "@/app/lib/actions/books";
import { useActionState } from "react";

export default function OwnedBookRow({ book }: { book: Book }) {
  const initialState: BookState = {};
  const removeBookById = removeOwnedBook.bind(null, book.id);
  const [state, formAction, isPending] = useActionState(
    removeBookById,
    initialState,
  );

  return (
    <div className="flex justify-between w-150">
      <div>{book.title}</div>
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
