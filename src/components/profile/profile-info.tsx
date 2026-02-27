import { Profile } from "@/types";

interface ProfileInfoProps {
  profile: Profile;
}

export function ProfileInfo({ profile }: ProfileInfoProps) {
  const hasInfo =
    profile.bio || profile.course || profile.department || profile.enrollment_year;

  if (!hasInfo) return null;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e5e5e5",
        marginBottom: "8px",
      }}
    >
      <div style={{ backgroundColor: "#3b5998", padding: "3px 6px" }}>
        <span
          style={{
            fontSize: "11px",
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Informações
        </span>
      </div>

      <div style={{ padding: "6px 8px" }}>
        {profile.bio && (
          <p
            style={{
              fontSize: "11px",
              fontFamily: "Arial, sans-serif",
              color: "#333",
              marginBottom: "4px",
            }}
          >
            {profile.bio}
          </p>
        )}

        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            {profile.course && (
              <tr>
                <td
                  style={{
                    fontSize: "11px",
                    fontFamily: "Arial, sans-serif",
                    color: "#999",
                    fontWeight: "bold",
                    paddingRight: "6px",
                    paddingBottom: "2px",
                    whiteSpace: "nowrap",
                    verticalAlign: "top",
                  }}
                >
                  Curso:
                </td>
                <td
                  style={{
                    fontSize: "11px",
                    fontFamily: "Arial, sans-serif",
                    color: "#333",
                    paddingBottom: "2px",
                  }}
                >
                  {profile.course_type && `${profile.course_type} em `}
                  {profile.course}
                </td>
              </tr>
            )}

            {profile.department && (
              <tr>
                <td
                  style={{
                    fontSize: "11px",
                    fontFamily: "Arial, sans-serif",
                    color: "#999",
                    fontWeight: "bold",
                    paddingRight: "6px",
                    paddingBottom: "2px",
                    whiteSpace: "nowrap",
                    verticalAlign: "top",
                  }}
                >
                  Faculdade:
                </td>
                <td
                  style={{
                    fontSize: "11px",
                    fontFamily: "Arial, sans-serif",
                    color: "#333",
                    paddingBottom: "2px",
                  }}
                >
                  {profile.department}
                </td>
              </tr>
            )}

            {profile.enrollment_year && (
              <tr>
                <td
                  style={{
                    fontSize: "11px",
                    fontFamily: "Arial, sans-serif",
                    color: "#999",
                    fontWeight: "bold",
                    paddingRight: "6px",
                    whiteSpace: "nowrap",
                    verticalAlign: "top",
                  }}
                >
                  Na UAlg desde:
                </td>
                <td
                  style={{
                    fontSize: "11px",
                    fontFamily: "Arial, sans-serif",
                    color: "#333",
                  }}
                >
                  {profile.enrollment_year}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
