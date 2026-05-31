"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction } from "../actions";

export function SignInForm() {
  const [state, formAction, isPending] = useActionState(signInAction, null);

  return (
    <form
      action={formAction}
      className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-6 shadow-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="username">نام کاربری</Label>
        <Input
          dir="ltr"
          id="username"
          name="username"
          autoComplete="username"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">رمز عبور</Label>
        <Input
          dir="ltr"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "در حال ورود..." : "ورود"}
      </Button>
    </form>
  );
}
