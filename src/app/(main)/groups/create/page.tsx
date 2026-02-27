"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createGroup } from "@/actions/groups";
import { useState } from "react";

export default function CreateGroupPage() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    await createGroup(formData);
    setIsLoading(false);
  }

  return (
    <div className="py-4">
      <Card className="mx-auto max-w-md p-4">
        <h1 className="mb-4 text-xl font-bold text-fb-text">Criar grupo</h1>

        <form action={handleSubmit} className="space-y-3">
          <Input
            id="name"
            name="name"
            label="Nome do grupo"
            placeholder="Nome do grupo"
            required
          />

          <div className="w-full">
            <label className="mb-1 block text-xs font-semibold text-fb-text-secondary">
              Descrição
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-md border border-fb-border bg-fb-white px-3 py-2 text-sm text-fb-text placeholder:text-fb-text-muted focus:border-fb-blue focus:outline-none"
              placeholder="Do que se trata este grupo?"
            />
          </div>

          <div className="w-full">
            <label className="mb-1 block text-xs font-semibold text-fb-text-secondary">
              Privacidade
            </label>
            <select
              name="privacy"
              defaultValue="public"
              className="w-full rounded-md border border-fb-border bg-fb-white px-3 py-2 text-sm text-fb-text focus:border-fb-blue focus:outline-none"
            >
              <option value="public">Público</option>
              <option value="private">Privado</option>
            </select>
          </div>

          <div className="w-full">
            <label className="mb-1 block text-xs font-semibold text-fb-text-secondary">
              Imagem de capa (opcional)
            </label>
            <input
              type="file"
              name="cover"
              accept="image/*"
              className="w-full text-sm text-fb-text-secondary"
            />
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            Criar grupo
          </Button>
        </form>
      </Card>
    </div>
  );
}
