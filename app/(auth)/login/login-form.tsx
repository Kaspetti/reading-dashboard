"use client";

import { LoginState, loginUser } from "@/app/lib/actions/auth";
import FieldError from "@/app/ui/field-error";
import { useActionState } from "react";

export default function LoginForm() {
  const initialState: LoginState = {};
  const [state, formAction] = useActionState(loginUser, initialState);

  return (
    <form action={formAction}>
      <div>
        <input
          id="identifier"
          name="identifier"
          type="text"
          className="border-1"
          defaultValue={state.identifier}
        />
        <label htmlFor="identifier">Email or Username</label>
        <FieldError name="identifier" errors={state.validationErrors} />
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
        Login
      </button>
      {state.success && <p>{state.success}</p>}
      {state.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}
