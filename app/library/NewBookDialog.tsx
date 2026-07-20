"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
  Fieldset,
  Field,
  Label,
  Input,
  Button,
} from "@headlessui/react";
import { BookState, createBook } from "../lib/actions/books";
import { useActionState, useEffect } from "react";
import FieldError from "../ui/field-error";

interface NewBookDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewBookDialog({ isOpen, onClose }: NewBookDialogProps) {
  const initialState: BookState = {};
  const [state, formAction, isPending] = useActionState(
    createBook,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border border-taupe-700 rounded-lg bg-taupe-100 p-12 text-taupe-500">
            <DialogTitle className="font-bold">New book</DialogTitle>
            <form action={formAction}>
              <Fieldset className="space-y-4">
                <Field>
                  <Label className="block font-semibold">Title</Label>
                  <Input
                    className="mt-1 block w-full border-2 border-taupe-300 rounded-lg outline-hidden p-1 focus:border-taupe-500"
                    name="title"
                    type="text"
                    placeholder="Book title..."
                  />
                  <FieldError name="title" errors={state.validationErrors} />
                </Field>
                <div className="flex gap-4">
                  <Field>
                    <Label className="block font-semibold">Author</Label>
                    <Input
                      className="mt-1 block border-2 border-taupe-300 rounded-lg outline-hidden p-1 focus:border-taupe-500"
                      name="author"
                      type="text"
                      placeholder="Author name..."
                    />
                    <FieldError name="author" errors={state.validationErrors} />
                  </Field>
                  <Field>
                    <Label className="block font-semibold">Pages</Label>
                    <Input
                      className="mt-1 block border-2 border-taupe-300 rounded-lg outline-hidden appearance-none p-1 focus:border-taupe-500"
                      name="pages"
                      type="number"
                      placeholder="Total pages"
                    />
                    <FieldError name="pages" errors={state.validationErrors} />
                  </Field>
                </div>
                <div className="flex gap-4 justify-end">
                  <Button
                    type="button"
                    onClick={onClose}
                    className="p-2 border border-taupe-700 rounded-lg bg-taupe-100 font-semibold hover:cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="p-2 border border-taupe-700 rounded-lg bg-taupe-700 text-taupe-100 font-semibold hover:cursor-pointer disabled:bg-taupe-400 disabled:cursor-not-allowed disabled:border-taupe-400"
                    disabled={isPending}
                  >
                    Add book
                  </Button>
                </div>
              </Fieldset>
            </form>
            {state.error && <p className="text-red">{state.error}</p>}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
