"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { joinGroup, leaveGroup } from "@/actions/groups";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Users, Globe, Lock } from "lucide-react";

interface GroupHeaderSectionProps {
  group: {
    id: string;
    name: string;
    description: string | null;
    cover_url: string | null;
    privacy: string;
  };
  isMember: boolean;
  userRole: string | null;
  memberCount: number;
}

export function GroupHeaderSection({
  group,
  isMember,
  userRole,
  memberCount,
}: GroupHeaderSectionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleJoin() {
    setIsLoading(true);
    await joinGroup(group.id);
    router.refresh();
  }

  async function handleLeave() {
    setIsLoading(true);
    await leaveGroup(group.id);
    router.refresh();
  }

  return (
    <Card className="overflow-hidden">
      {/* Cover */}
      <div className="relative h-[160px] bg-gradient-to-r from-fb-blue to-fb-blue-light">
        {group.cover_url && (
          <Image
            src={group.cover_url}
            alt={group.name}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-fb-text">{group.name}</h1>
            <div className="mt-1 flex items-center gap-3 text-sm text-fb-text-secondary">
              {group.privacy === "public" ? (
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  Público
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5" />
                  Privado
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {memberCount} membro{memberCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {isMember ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLeave}
              isLoading={isLoading}
              disabled={userRole === "admin"}
            >
              {userRole === "admin" ? "Admin" : "Sair do grupo"}
            </Button>
          ) : (
            <Button size="sm" onClick={handleJoin} isLoading={isLoading}>
              Juntar-se
            </Button>
          )}
        </div>

        {group.description && (
          <p className="mt-3 text-sm text-fb-text-secondary">
            {group.description}
          </p>
        )}
      </div>
    </Card>
  );
}
