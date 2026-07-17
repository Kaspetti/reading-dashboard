"use client";

import React, { useCallback, useState } from "react";
import NewBookDialog from "./NewBookDialog";
import { Button } from "@headlessui/react";
import BookSearch from "./BookSearch";

export default function LibraryClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <div className="p-2">
      <div className="flex justify-end">
        <BookSearch />
        <Button onClick={() => setIsOpen(true)} className="border-1 p-2">
          New Book
        </Button>

        <NewBookDialog
          key={isOpen ? "open" : "closed"}
          isOpen={isOpen}
          onClose={handleClose}
        />
      </div>
      {children}
    </div>
  );
}
