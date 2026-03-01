import { Profile } from "@/types";

interface ProfileInfoProps {
  profile: Profile;
}

function formatBirthday(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });
}

export function ProfileInfo({ profile }: ProfileInfoProps) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e5e5",
        marginBottom: "8px",
      }}
    >
      {/* Section header */}
      <div style={{ backgroundColor: "#3b5998", padding: "3px 6px" }}>
        <span
          style={{
            fontSize: "11px",
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Informação
        </span>
      </div>

      <div style={{ padding: "6px 10px" }}>

        {/* Informações da Conta */}
        <InfoSection title="Informações da Conta">
          <InfoRow label="Nome:" value={profile.full_name} />
          <InfoRow label="Redes:" value="Universidade do Algarve" />
        </InfoSection>

        {/* Informações Básicas */}
        {(profile.birthday || profile.hometown || profile.relationship_status) && (
          <InfoSection title="Informações Básicas">
            {profile.relationship_status && (
              <InfoRow label="Estado:" value={profile.relationship_status} />
            )}
            {profile.birthday && (
              <InfoRow label="Nascimento:" value={formatBirthday(profile.birthday) ?? ""} />
            )}
            {profile.hometown && (
              <InfoRow label="Cidade natal:" value={profile.hometown} />
            )}
          </InfoSection>
        )}

        {/* Info de Contacto */}
        <InfoSection title="Info de Contacto">
          <InfoRow label="Email:" value={profile.email} />
        </InfoSection>

        {/* Informações Pessoais */}
        {(profile.bio || profile.activities || profile.interests || profile.favorite_music || profile.favorite_books || profile.favorite_quotes) && (
          <InfoSection title="Informações Pessoais">
            {profile.activities && (
              <InfoRow label="Atividades:" value={profile.activities} multiline />
            )}
            {profile.interests && (
              <InfoRow label="Interesses:" value={profile.interests} multiline />
            )}
            {profile.favorite_music && (
              <InfoRow label="Música favorita:" value={profile.favorite_music} multiline />
            )}
            {profile.favorite_books && (
              <InfoRow label="Livros favoritos:" value={profile.favorite_books} multiline />
            )}
            {profile.favorite_quotes && (
              <InfoRow label="Citações favoritas:" value={profile.favorite_quotes} multiline />
            )}
            {profile.bio && (
              <InfoRow label="Sobre mim:" value={profile.bio} multiline />
            )}
          </InfoSection>
        )}

        {/* Informações Académicas */}
        {(profile.course || profile.high_school || profile.enrollment_year) && (
          <InfoSection title="Informações Académicas">
            {profile.course && (
              <InfoRow
                label="Universidade:"
                value={
                  profile.course_type
                    ? `${profile.course_type} em ${profile.course}`
                    : profile.course
                }
              />
            )}
            {profile.department && (
              <InfoRow label="Faculdade:" value={profile.department} />
            )}
            {profile.enrollment_year && (
              <InfoRow label="Período:" value={`${profile.enrollment_year} – Presente`} />
            )}
            {profile.high_school && (
              <InfoRow label="Escola secundária:" value={profile.high_school} />
            )}
          </InfoSection>
        )}

        {/* Informações Profissionais */}
        {(profile.work_company || profile.work_period || profile.work_description) && (
          <InfoSection title="Informações Profissionais">
            {profile.work_company && (
              <InfoRow label="Empresa:" value={profile.work_company} />
            )}
            {profile.work_period && (
              <InfoRow label="Período:" value={profile.work_period} />
            )}
            {profile.work_description && (
              <InfoRow label="Descrição:" value={profile.work_description} multiline />
            )}
          </InfoSection>
        )}

      </div>
    </div>
  );
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "8px" }}>
      <div
        style={{
          fontSize: "11px",
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          color: "#333",
          borderBottom: "1px solid #e5e5e5",
          paddingBottom: "2px",
          marginBottom: "4px",
        }}
      >
        {title}
      </div>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function InfoRow({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <tr>
      <td
        style={{
          fontSize: "11px",
          fontFamily: "Arial, sans-serif",
          color: "#999",
          fontWeight: "bold",
          paddingRight: "8px",
          paddingBottom: "2px",
          whiteSpace: "nowrap",
          verticalAlign: "top",
        }}
      >
        {label}
      </td>
      <td
        style={{
          fontSize: "11px",
          fontFamily: "Arial, sans-serif",
          color: "#333",
          paddingBottom: "2px",
          wordBreak: multiline ? "break-word" : undefined,
        }}
      >
        {value}
      </td>
    </tr>
  );
}
