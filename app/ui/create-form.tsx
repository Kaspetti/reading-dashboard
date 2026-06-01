"use client";

import { useActionState } from "react";
import { createUser, State } from "@/app/lib/actions";

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createUser, initialState);

  return (
    <form action={formAction}>
      <div>
        <input id="username" name="username" type="text" className="border-1" />
        <label htmlFor="username">Username: </label>
      </div>
      <div>
        <input
          id="display-name"
          name="display-name"
          type="text"
          className="border-1"
        />
        <label htmlFor="display-name">Display Name: </label>
      </div>
      <div>
        <input id="email" name="email" type="email" className="border-1" />
        <label htmlFor="email">E-mail: </label>
      </div>
      <button type="submit" className="border-1">
        Create User
      </button>
      <p>{state.message}</p>
      {state.errors?.email && (
        <p className="text-red-500">{state.errors?.email[0]}</p>
      )}
    </form>
  );
}
