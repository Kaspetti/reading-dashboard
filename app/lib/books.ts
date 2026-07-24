import { UserBookEntry } from "./actions/books";

export function bookDisplayFields(book: UserBookEntry) {
  return {
    title: book.edition?.title ?? book.rawTitle ?? "untitled",
    author: book.edition?.work?.author ?? book.rawAuthor ?? "Unknown author",
    pages: book.edition?.pages ?? book.rawPages ?? null,
  };
}
