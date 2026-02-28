"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logout } from "@/actions/auth";
import { useState } from "react";

export function Header() {
  const { profile } = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        backgroundColor: "#3b5998",
        borderBottom: "1px solid #2d4373",
        height: "28px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          width: "100%",
          maxWidth: "960px",
          padding: "0 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* Left: Logo + Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Link
            href="/feed"
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: "16px",
              fontFamily: "Arial, sans-serif",
              textDecoration: "none",
              letterSpacing: "-0.5px",
            }}
          >
            theUALGbook
          </Link>
          <form action="/search" style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              name="q"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar"
              style={{
                height: "18px",
                width: "150px",
                fontSize: "11px",
                fontFamily: "Arial, sans-serif",
                border: "1px solid #8b9dc3",
                padding: "0 4px",
                backgroundColor: "#fff",
                color: "#333",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                height: "20px",
                padding: "0 6px",
                fontSize: "11px",
                fontFamily: "Arial, sans-serif",
                backgroundColor: "#5b74a8",
                color: "#fff",
                border: "1px solid #2d4373",
                borderLeft: "none",
                cursor: "pointer",
              }}
            >
              Ir
            </button>
          </form>
        </div>

        {/* Right: text nav links */}
        <nav className="hidden lg:flex" style={{ alignItems: "center" }}>
          {profile && (
            <>
              <HeaderLink href={`/profile/${profile.username}`}>
                {profile.full_name?.split(" ")[0] ?? "Perfil"}
              </HeaderLink>
              <Divider />
            </>
          )}
          <HeaderLink href="/friends">Amigos</HeaderLink>
          <Divider />
          <HeaderLink href="/groups">Grupos</HeaderLink>
          <Divider />
          <HeaderLink href="/messages">Caixa de entrada</HeaderLink>
          <Divider />
          <HeaderLink href="/notifications">Notificações</HeaderLink>
          <Divider />
          <button
            onClick={() => logout()}
            style={{
              background: "none",
              border: "none",
              color: "#d8dfea",
              fontSize: "11px",
              fontFamily: "Arial, sans-serif",
              cursor: "pointer",
              padding: "0 4px",
            }}
            onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}

function HeaderLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        color: "#d8dfea",
        fontSize: "11px",
        fontFamily: "Arial, sans-serif",
        textDecoration: "none",
        padding: "0 4px",
      }}
      onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
      onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
    >
      {children}
    </Link>
  );
}

function Divider() {
  return (
    <span
      style={{
        color: "#8b9dc3",
        fontSize: "11px",
        fontFamily: "Arial, sans-serif",
        userSelect: "none",
      }}
    >
      |
    </span>
  );
}
