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
  friendshipId,
}: ProfileHeaderProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const isOwner = profile.id === currentUserId;

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
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e5e5e5",
          marginBottom: "8px",
        }}
      >
        {/* Blue title bar */}
        <div style={{ backgroundColor: "#3b5998", padding: "3px 6px" }}>
          <span
            style={{
              fontSize: "11px",
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            {profile.full_name}
          </span>
        </div>

        {/* Profile info row */}
        <div style={{ padding: "10px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
          {/* Avatar with optional upload */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <Avatar src={profile.avatar_url} alt={profile.full_name} size="xl" />
            {isOwner && (
              <>
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  style={{
                    display: "block",
                    marginTop: "3px",
                    fontSize: "11px",
                    fontFamily: "Arial, sans-serif",
                    color: "#3b5998",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    textDecoration: "underline",
                  }}
                >
                  Mudar foto
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarUpload}
                />
              </>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "20px",
                fontFamily: "Arial, sans-serif",
                fontWeight: "bold",
                color: "#333",
                marginBottom: "4px",
              }}
            >
              {profile.full_name}
            </div>

            {profile.course && (
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "Arial, sans-serif",
                  color: "#555",
                  marginBottom: "2px",
                }}
              >
                {profile.course_type && (
                  <span>{profile.course_type} em </span>
                )}
                <span>{profile.course}</span>
              </div>
            )}

            {profile.department && (
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "Arial, sans-serif",
                  color: "#555",
                  marginBottom: "2px",
                }}
              >
                {profile.department}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ marginTop: "8px", display: "flex", gap: "4px" }}>
              {isOwner ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  style={{
                    fontSize: "11px",
                    fontFamily: "Arial, sans-serif",
                    backgroundColor: "#f5f5f5",
                    color: "#333",
                    border: "1px solid #ccc",
                    padding: "2px 8px",
                    cursor: "pointer",
                  }}
                >
                  Editar perfil
                </button>
              ) : (
                <>
                  {friendshipStatus === "accepted" ? (
                    <span
                      style={{
                        fontSize: "11px",
                        fontFamily: "Arial, sans-serif",
                        color: "#555",
                      }}
                    >
                      ✓ Amigos
                    </span>
                  ) : friendshipStatus === "pending" ? (
                    <span
                      style={{
                        fontSize: "11px",
                        fontFamily: "Arial, sans-serif",
                        color: "#999",
                      }}
                    >
                      Pedido pendente
                    </span>
                  ) : (
                    <button
                      onClick={handleAddFriend}
                      style={{
                        fontSize: "11px",
                        fontFamily: "Arial, sans-serif",
                        backgroundColor: "#3b5998",
                        color: "#fff",
                        border: "1px solid #2d4373",
                        padding: "2px 8px",
                        cursor: "pointer",
                      }}
                    >
                      + Adicionar como amigo
                    </button>
                  )}
                  <button
                    onClick={handleMessage}
                    style={{
                      fontSize: "11px",
                      fontFamily: "Arial, sans-serif",
                      backgroundColor: "#f5f5f5",
                      color: "#333",
                      border: "1px solid #ccc",
                      padding: "2px 8px",
                      cursor: "pointer",
                    }}
                  >
                    Enviar mensagem
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
