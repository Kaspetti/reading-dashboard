"use client";

import BookSearch from "./BookSearch";

export default function LibraryClient({
  children,
  ownedBooks,
}: {
  children: React.ReactNode;
  ownedBooks: Set<number>;
}) {
  return (
    <div className="p-2">
      <div className="flex justify-end float-right">
        <BookSearch ownedBooks={ownedBooks} />
      </div>
      {children}
    </div>
  );
}
