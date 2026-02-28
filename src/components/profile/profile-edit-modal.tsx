"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Profile } from "@/types";
import { COURSE_TYPES } from "@/lib/constants";
import { updateProfile } from "@/actions/profile";
import { useRouter } from "next/navigation";

interface ProfileEditModalProps {
  profile: Profile;
  onClose: () => void;
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  height: "20px",
  fontSize: "11px",
  fontFamily: "Arial, sans-serif",
  border: "1px solid #ccc",
  padding: "0 4px",
  color: "#333",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  fontFamily: "Arial, sans-serif",
  fontWeight: "bold",
  color: "#555",
  whiteSpace: "nowrap",
  paddingRight: "8px",
  verticalAlign: "top",
  paddingTop: "3px",
  paddingBottom: "6px",
};

export function ProfileEditModal({ profile, onClose }: ProfileEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
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
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              fontSize: "11px",
              fontFamily: "Arial, sans-serif",
              color: "#cc0000",
              backgroundColor: "#fff0f0",
              border: "1px solid #ffcccc",
              padding: "4px 6px",
              marginBottom: "8px",
            }}
          >
            {error}
          </div>
        )}

        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            <tr>
              <td style={labelStyle}>Nome completo:</td>
              <td style={{ paddingBottom: "6px" }}>
                <input name="fullName" defaultValue={profile.full_name} required style={fieldStyle} />
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Username:</td>
              <td style={{ paddingBottom: "6px" }}>
                <input name="username" defaultValue={profile.username} required style={fieldStyle} />
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Bio:</td>
              <td style={{ paddingBottom: "6px" }}>
                <textarea
                  name="bio"
                  defaultValue={profile.bio || ""}
                  rows={3}
                  maxLength={500}
                  placeholder="Conta um pouco sobre ti..."
                  style={{
                    width: "100%",
                    fontSize: "11px",
                    fontFamily: "Arial, sans-serif",
                    border: "1px solid #ccc",
                    padding: "3px 4px",
                    color: "#333",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Curso:</td>
              <td style={{ paddingBottom: "6px" }}>
                <input name="course" defaultValue={profile.course || ""} style={fieldStyle} />
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Tipo de curso:</td>
              <td style={{ paddingBottom: "6px" }}>
                <select
                  name="courseType"
                  defaultValue={profile.course_type || ""}
                  style={{ ...fieldStyle, height: "22px" }}
                >
                  <option value="">Selecionar</option>
                  {COURSE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Faculdade:</td>
              <td style={{ paddingBottom: "6px" }}>
                <input name="department" defaultValue={profile.department || ""} style={fieldStyle} />
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Ano de ingresso:</td>
              <td style={{ paddingBottom: "6px" }}>
                <input
                  name="enrollmentYear"
                  type="number"
                  min={2000}
                  max={2030}
                  defaultValue={profile.enrollment_year?.toString() || ""}
                  style={{ ...fieldStyle, width: "80px" }}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ borderTop: "1px solid #e5e5e5", margin: "8px 0" }} />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "4px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              fontSize: "11px",
              fontFamily: "Arial, sans-serif",
              backgroundColor: "#f5f5f5",
              color: "#333",
              border: "1px solid #ccc",
              padding: "2px 10px",
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              fontSize: "11px",
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              backgroundColor: isLoading ? "#8b9dc3" : "#3b5998",
              color: "#fff",
              border: "1px solid #2d4373",
              padding: "2px 10px",
              cursor: isLoading ? "default" : "pointer",
            }}
          >
            {isLoading ? "A guardar..." : "Guardar alterações"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
