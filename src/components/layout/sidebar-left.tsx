"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Avatar } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/feed", label: "Feed de notícias" },
  { href: "/friends", label: "Amigos" },
  { href: "/groups", label: "Grupos" },
  { href: "/messages", label: "Mensagens" },
  { href: "/notifications", label: "Notificações" },
];

export function SidebarLeft() {
  const { profile } = useCurrentUser();
  const pathname = usePathname();

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: "28px",
        width: "200px",
        height: "calc(100vh - 28px)",
        overflowY: "auto",
        padding: "8px 4px",
      }}
    >
      {/* Profile box */}
      {profile && (
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #e5e5e5",
            marginBottom: "8px",
            padding: "8px",
          }}
        >
          <Link
            href={`/profile/${profile.username}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              textDecoration: "none",
            }}
          >
            <Avatar src={profile.avatar_url} alt={profile.full_name} size="sm" />
            <span
              style={{
                fontSize: "11px",
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
                color: "#3b5998",
              }}
            >
              {profile.full_name}
            </span>
          </Link>
        </div>
      )}

      {/* Navigation box */}
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
            Navegação
          </span>
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: "4px 0" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{
                    display: "block",
                    padding: "2px 8px",
                    fontSize: "11px",
                    fontFamily: "Arial, sans-serif",
                    color: isActive ? "#fff" : "#3b5998",
                    backgroundColor: isActive ? "#3b5998" : "transparent",
                    textDecoration: "none",
                  }}
                  onMouseOver={(e) => {
                    if (!isActive)
                      e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
