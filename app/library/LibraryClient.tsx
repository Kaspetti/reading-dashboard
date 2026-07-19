"use client";

import BookSearch from "./BookSearch";

export default function LibraryClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-2">
      <div className="flex justify-end float-right">
        <BookSearch />
      </div>
      {children}
    </div>
  );
}
