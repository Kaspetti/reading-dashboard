"use client";

import { createUser, State } from "@/app/lib/actions";
import FieldError from "@/app/ui/field-error";
import { useActionState } from "react";

export default function RegisterForm() {
  const initialState: State = {};
  const [state, formAction] = useActionState(createUser, initialState);

  return (
    <form action={formAction}>
      <div>
        <input id="username" name="username" type="text" className="border-1" />
        <label htmlFor="username">Username</label>
        <FieldError name="username" errors={state.validationErrors} />
      </div>
      <div>
        <input
          id="display-name"
          name="display-name"
          type="text"
          className="border-1"
        />
        <label htmlFor="display-name">Display Name</label>
      </div>
      <div>
        <input id="email" name="email" type="email" className="border-1" />
        <label htmlFor="email">E-mail</label>
        <FieldError name="email" errors={state.validationErrors} />
      </div>
      <div>
        <input
          id="password"
          name="password"
          type="password"
          className="border-1"
        />
        <label htmlFor="password">Password</label>
        <FieldError name="password" errors={state.validationErrors} />
      </div>
      <button type="submit" className="border-1">
        Register
      </button>
      {state.success && <p>{state.success}</p>}
    </form>
  );
}
