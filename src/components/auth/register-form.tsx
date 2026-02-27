"use client";

import { useState } from "react";
import { register } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { COURSE_TYPES } from "@/lib/constants";
import Link from "next/link";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setErrors({});

    // Client-side validation
    const email = formData.get("email") as string;
    if (email && !email.endsWith("@ualg.pt")) {
      setErrors({ email: "Apenas emails @ualg.pt são permitidos" });
      setIsLoading(false);
      return;
    }

    const result = await register(formData);
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
        id="fullName"
        name="fullName"
        placeholder="Nome completo"
        required
        error={errors.fullName}
      />

      <Input
        id="email"
        name="email"
        type="email"
        placeholder="Email (@ualg.pt)"
        required
        error={errors.email}
      />

      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Password (mínimo 8 caracteres)"
        required
        minLength={8}
        error={errors.password}
      />

      <Input
        id="course"
        name="course"
        placeholder="Curso (ex: Engenharia Informática)"
        required
        error={errors.course}
      />

      <div className="w-full">
        <select
          id="courseType"
          name="courseType"
          required
          className="w-full rounded-md border border-fb-border bg-fb-white px-3 py-2 text-sm text-fb-text focus:border-fb-blue focus:outline-none"
          defaultValue=""
        >
          <option value="" disabled>
            Tipo de curso
          </option>
          {COURSE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.courseType && (
          <p className="mt-1 text-xs text-fb-red">{errors.courseType}</p>
        )}
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full bg-fb-green hover:opacity-90"
        size="lg"
      >
        Registar
      </Button>

      <div className="text-center text-sm">
        <span className="text-fb-text-secondary">Já tens conta? </span>
        <Link href="/login" className="font-semibold text-fb-link hover:underline">
          Entra aqui
        </Link>
      </div>
    </form>
  );
}
