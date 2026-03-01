"use client";

import { useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Profile } from "@/types";
import { uploadAvatar } from "@/actions/profile";
import { sendFriendRequest } from "@/actions/friends";
import { getOrCreateConversation } from "@/actions/messages";
import { useRouter } from "next/navigation";
import { ProfileEditModal } from "./profile-edit-modal";

interface ProfileHeaderProps {
  profile: Profile;
  currentUserId: string;
  friendshipStatus?: string | null;
  friendshipId?: string | null;
}

export function ProfileHeader({
  profile,
  currentUserId,
  friendshipStatus,
}: ProfileHeaderProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const isOwner = profile.id === currentUserId;
  const firstName = profile.full_name?.split(" ")[0] ?? "utilizador";

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set("avatar", file);
    await uploadAvatar(formData);
    router.refresh();
  }

  async function handleAddFriend() {
    await sendFriendRequest(profile.id);
    router.refresh();
  }

  async function handleMessage() {
    const result = await getOrCreateConversation(profile.id);
    if (result.conversationId) {
      router.push(`/messages/${result.conversationId}`);
    }
  }

  return (
    <>
      {/* Profile photo */}
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e5e5e5",
          padding: "4px",
          marginBottom: "6px",
          textAlign: "center",
        }}
      >
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            style={{
              width: "100%",
              maxWidth: "175px",
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          />
        ) : (
          <Avatar src={null} alt={profile.full_name} size="xl" />
        )}
      </div>

      {/* Action links */}
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e5e5e5",
          padding: "4px 0",
          marginBottom: "6px",
        }}
      >
        {isOwner ? (
          <>
            <ActionLink onClick={() => avatarInputRef.current?.click()}>
              Mudar foto de perfil
            </ActionLink>
            <ActionLink onClick={() => setShowEditModal(true)}>
              Editar perfil
            </ActionLink>
          </>
        ) : (
          <>
            {friendshipStatus === "accepted" ? (
              <ActionText>✓ Já são amigos</ActionText>
            ) : friendshipStatus === "pending" ? (
              <ActionText>Pedido de amizade pendente</ActionText>
            ) : (
              <ActionLink onClick={handleAddFriend}>
                + Adicionar {firstName} como amigo
              </ActionLink>
            )}
            <ActionLink onClick={handleMessage}>
              Enviar mensagem a {firstName}
            </ActionLink>
          </>
        )}
      </div>

      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleAvatarUpload}
      />

      {showEditModal && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}

function ActionLink({
  onClick,
  href,
  children,
}: {
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
}) {
  const style: React.CSSProperties = {
    display: "block",
    padding: "2px 8px",
    fontSize: "11px",
    fontFamily: "Arial, sans-serif",
    color: "#3b5998",
    textDecoration: "none",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
  };

  if (href) {
    return (
      <a href={href} style={style}>
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      style={style}
      onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
      onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
    >
      {children}
    </button>
  );
}

function ActionText({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "block",
        padding: "2px 8px",
        fontSize: "11px",
        fontFamily: "Arial, sans-serif",
        color: "#555",
      }}
    >
      {children}
    </span>
  );
}
