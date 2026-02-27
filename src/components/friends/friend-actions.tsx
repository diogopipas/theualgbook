"use client";

import { Button } from "@/components/ui/button";
import { acceptFriendRequest, rejectFriendRequest } from "@/actions/friends";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface FriendActionsProps {
  friendshipId: string;
  type: "request";
}

export function FriendActions({ friendshipId, type }: FriendActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [responded, setResponded] = useState(false);

  async function handleAccept() {
    setIsLoading(true);
    await acceptFriendRequest(friendshipId);
    setResponded(true);
    router.refresh();
  }

  async function handleReject() {
    setIsLoading(true);
    await rejectFriendRequest(friendshipId);
    setResponded(true);
    router.refresh();
  }

  if (responded) {
    return <p className="mt-1 text-xs text-fb-text-muted">Respondido</p>;
  }

  return (
    <div className="mt-2 flex gap-2">
      <Button size="sm" onClick={handleAccept} isLoading={isLoading}>
        Confirmar
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={handleReject}
        disabled={isLoading}
      >
        Eliminar
      </Button>
    </div>
  );
}
