"use client";

import { Avatar } from "@/components/ui/avatar";
import { Profile } from "@/types";
import Link from "next/link";

interface SidebarRightProps {
  onlineFriends?: Profile[];
}

export function SidebarRight({ onlineFriends = [] }: SidebarRightProps) {
  return (
    <aside
      className="xl:block hidden"
      style={{
        position: "fixed",
        right: 0,
        top: "28px",
        width: "200px",
        height: "calc(100vh - 28px)",
        overflowY: "auto",
        padding: "8px 6px",
      }}
    >
      {/* Online friends */}
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
            Contactos
          </span>
        </div>
        <div style={{ padding: "6px 8px" }}>
          {onlineFriends.length === 0 ? (
            <p
              style={{
                fontSize: "11px",
                fontFamily: "Arial, sans-serif",
                color: "#999",
                margin: 0,
              }}
            >
              Nenhum amigo online
            </p>
          ) : (
            <div>
              {onlineFriends.map((friend) => (
                <Link
                  key={friend.id}
                  href={`/messages?user=${friend.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "2px 0",
                    textDecoration: "none",
                  }}
                >
                  <Avatar
                    src={friend.avatar_url}
                    alt={friend.full_name}
                    size="sm"
                    isOnline={true}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: "Arial, sans-serif",
                      color: "#3b5998",
                    }}
                  >
                    {friend.full_name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Graffiti */}
      <div
        style={{
          marginTop: "40px",
          transform: "rotate(-8deg)",
          textAlign: "center",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "'Permanent Marker', 'Comic Sans MS', cursive",
            fontSize: "15px",
            color: "#3b5998",
            opacity: 0.35,
            lineHeight: 1.4,
            display: "block",
          }}
        >
          Vintage,
          <br />
          because why not?
        </span>
      </div>
    </aside>
  );
}
