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

const textareaStyle: React.CSSProperties = {
  width: "100%",
  fontSize: "11px",
  fontFamily: "Arial, sans-serif",
  border: "1px solid #ccc",
  padding: "3px 4px",
  color: "#333",
  outline: "none",
  resize: "vertical",
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

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: "11px",
  fontFamily: "Arial, sans-serif",
  fontWeight: "bold",
  color: "#fff",
  backgroundColor: "#3b5998",
  padding: "2px 6px",
  marginTop: "10px",
  marginBottom: "4px",
};

const RELATIONSHIP_STATUSES = [
  "Solteiro/a",
  "Numa relação",
  "Comprometido/a",
  "Casado/a",
  "Complicado",
] as const;

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

        {/* Informações da Conta */}
        <div style={sectionHeaderStyle}>Informações da Conta</div>
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
          </tbody>
        </table>

        {/* Informações Básicas */}
        <div style={sectionHeaderStyle}>Informações Básicas</div>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            <tr>
              <td style={labelStyle}>Estado:</td>
              <td style={{ paddingBottom: "6px" }}>
                <select
                  name="relationshipStatus"
                  defaultValue={profile.relationship_status ?? ""}
                  style={{ ...fieldStyle, height: "22px" }}
                >
                  <option value="">Selecionar</option>
                  {RELATIONSHIP_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Nascimento:</td>
              <td style={{ paddingBottom: "6px" }}>
                <input
                  name="birthday"
                  type="date"
                  defaultValue={profile.birthday ?? ""}
                  style={{ ...fieldStyle, height: "22px" }}
                />
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Cidade natal:</td>
              <td style={{ paddingBottom: "6px" }}>
                <input name="hometown" defaultValue={profile.hometown ?? ""} style={fieldStyle} />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Informações Pessoais */}
        <div style={sectionHeaderStyle}>Informações Pessoais</div>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            <tr>
              <td style={labelStyle}>Atividades:</td>
              <td style={{ paddingBottom: "6px" }}>
                <textarea name="activities" defaultValue={profile.activities ?? ""} rows={2} style={textareaStyle} />
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Interesses:</td>
              <td style={{ paddingBottom: "6px" }}>
                <textarea name="interests" defaultValue={profile.interests ?? ""} rows={2} style={textareaStyle} />
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Música favorita:</td>
              <td style={{ paddingBottom: "6px" }}>
                <textarea name="favoriteMusic" defaultValue={profile.favorite_music ?? ""} rows={2} style={textareaStyle} />
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Livros favoritos:</td>
              <td style={{ paddingBottom: "6px" }}>
                <textarea name="favoriteBooks" defaultValue={profile.favorite_books ?? ""} rows={2} style={textareaStyle} />
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Citações favoritas:</td>
              <td style={{ paddingBottom: "6px" }}>
                <textarea name="favoriteQuotes" defaultValue={profile.favorite_quotes ?? ""} rows={2} style={textareaStyle} />
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Sobre mim:</td>
              <td style={{ paddingBottom: "6px" }}>
                <textarea
                  name="bio"
                  defaultValue={profile.bio ?? ""}
                  rows={3}
                  maxLength={500}
                  style={textareaStyle}
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Informações Académicas */}
        <div style={sectionHeaderStyle}>Informações Académicas</div>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            <tr>
              <td style={labelStyle}>Curso:</td>
              <td style={{ paddingBottom: "6px" }}>
                <input name="course" defaultValue={profile.course ?? ""} style={fieldStyle} />
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Tipo de curso:</td>
              <td style={{ paddingBottom: "6px" }}>
                <select
                  name="courseType"
                  defaultValue={profile.course_type ?? ""}
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
                <input name="department" defaultValue={profile.department ?? ""} style={fieldStyle} />
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
                  defaultValue={profile.enrollment_year?.toString() ?? ""}
                  style={{ ...fieldStyle, width: "80px" }}
                />
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Escola secundária:</td>
              <td style={{ paddingBottom: "6px" }}>
                <input name="highSchool" defaultValue={profile.high_school ?? ""} style={fieldStyle} />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Informações Profissionais */}
        <div style={sectionHeaderStyle}>Informações Profissionais</div>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            <tr>
              <td style={labelStyle}>Empresa:</td>
              <td style={{ paddingBottom: "6px" }}>
                <input name="workCompany" defaultValue={profile.work_company ?? ""} style={fieldStyle} />
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Período:</td>
              <td style={{ paddingBottom: "6px" }}>
                <input
                  name="workPeriod"
                  placeholder="ex: 2023 – Presente"
                  defaultValue={profile.work_period ?? ""}
                  style={fieldStyle}
                />
              </td>
            </tr>
            <tr>
              <td style={labelStyle}>Descrição:</td>
              <td style={{ paddingBottom: "6px" }}>
                <textarea name="workDescription" defaultValue={profile.work_description ?? ""} rows={2} style={textareaStyle} />
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ borderTop: "1px solid #e5e5e5", margin: "10px 0 8px" }} />

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
