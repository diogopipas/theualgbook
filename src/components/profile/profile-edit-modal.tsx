"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types";
import { COURSE_TYPES } from "@/lib/constants";
import { updateProfile } from "@/actions/profile";
import { useRouter } from "next/navigation";

interface ProfileEditModalProps {
  profile: Profile;
  onClose: () => void;
}

export function ProfileEditModal({ profile, onClose }: ProfileEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await updateProfile(formData);
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    router.refresh();
    onClose();
  }

  return (
    <Modal isOpen onClose={onClose} title="Editar Perfil">
      <form action={handleSubmit} className="space-y-3">
        {error && (
          <div className="rounded-md bg-red-50 border border-fb-red/20 p-3 text-sm text-fb-red">
            {error}
          </div>
        )}

        <Input
          id="fullName"
          name="fullName"
          label="Nome completo"
          defaultValue={profile.full_name}
          required
        />

        <Input
          id="username"
          name="username"
          label="Username"
          defaultValue={profile.username}
          required
        />

        <div className="w-full">
          <label className="mb-1 block text-xs font-semibold text-fb-text-secondary">
            Bio
          </label>
          <textarea
            name="bio"
            defaultValue={profile.bio || ""}
            rows={3}
            maxLength={500}
            className="w-full rounded-md border border-fb-border bg-fb-white px-3 py-2 text-sm text-fb-text placeholder:text-fb-text-muted focus:border-fb-blue focus:outline-none"
            placeholder="Conta um pouco sobre ti..."
          />
        </div>

        <Input
          id="course"
          name="course"
          label="Curso"
          defaultValue={profile.course || ""}
        />

        <div className="w-full">
          <label className="mb-1 block text-xs font-semibold text-fb-text-secondary">
            Tipo de curso
          </label>
          <select
            name="courseType"
            defaultValue={profile.course_type || ""}
            className="w-full rounded-md border border-fb-border bg-fb-white px-3 py-2 text-sm text-fb-text focus:border-fb-blue focus:outline-none"
          >
            <option value="">Selecionar</option>
            {COURSE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <Input
          id="department"
          name="department"
          label="Departamento / Faculdade"
          defaultValue={profile.department || ""}
        />

        <Input
          id="enrollmentYear"
          name="enrollmentYear"
          label="Ano de ingresso"
          type="number"
          min={2000}
          max={2030}
          defaultValue={profile.enrollment_year?.toString() || ""}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Guardar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
