"use client";

import { Button } from "@headlessui/react";
import {
  BookState,
  UserBookEntry,
  removeUserBookEntry,
} from "@/app/lib/actions/books";
import { useActionState } from "react";
import { bookDisplayFields } from "../lib/books";

export default function OwnedBookRow({ book }: { book: UserBookEntry }) {
  const initialState: BookState = {};
  const removeBookById = removeUserBookEntry.bind(null, book.id);
  const [state, formAction, isPending] = useActionState(
    removeBookById,
    initialState,
  );

  const bookDisplay = bookDisplayFields(book);

  return (
    <div className="flex justify-between w-150">
      <div>
        {bookDisplay.title}
        {!book.edition && !book.isbn && (
          <span className="text-gray-500"> unverified</span>
        )}
        {!book.edition && book.isbn && (
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
