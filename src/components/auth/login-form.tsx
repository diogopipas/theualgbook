"use client";

import { useState } from "react";
import { login } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
    setIsLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded-md bg-red-50 border border-fb-red/20 p-3 text-sm text-fb-red">
          {error}
        </div>
      )}

      <Input
        id="email"
        name="email"
        type="email"
        placeholder="Email"
        required
      />

      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        required
      />

      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full"
        size="lg"
      >
        Entrar
      </Button>

      <div className="border-t border-fb-border pt-3 text-center">
        <Link
          href="/register"
          className="inline-block rounded-md bg-fb-green px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
        >
          Criar nova conta
        </Link>
      </div>
    </form>
  );
}
