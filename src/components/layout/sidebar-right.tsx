"use client";

import { Avatar } from "@/components/ui/avatar";
import { Profile } from "@/types";
import Link from "next/link";

interface SidebarRightProps {
  onlineFriends?: Profile[];
}

export function SidebarRight({ onlineFriends = [] }: SidebarRightProps) {
  return (
    <aside className="fixed right-0 top-[42px] hidden h-[calc(100vh-42px)] w-[220px] overflow-y-auto px-3 pt-3 xl:block">
      {/* Online friends */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-fb-text-secondary">
          Contactos
        </h3>
        {onlineFriends.length === 0 ? (
          <p className="text-xs text-fb-text-muted">
            Nenhum amigo online
          </p>
        ) : (
          <div className="space-y-1">
            {onlineFriends.map((friend) => (
              <Link
                key={friend.id}
                href={`/messages?user=${friend.id}`}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-fb-border/50"
              >
                <Avatar
                  src={friend.avatar_url}
                  alt={friend.full_name}
                  size="sm"
                  isOnline={true}
                />
                <span className="text-sm text-fb-text">
                  {friend.full_name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
