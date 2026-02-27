"use client";

import Link from "next/link";
import { Home, Users, Layers, MessageCircle, Bell } from "lucide-react";

const navItems = [
  { href: "/feed", icon: Home, label: "Feed" },
  { href: "/friends", icon: Users, label: "Amigos" },
  { href: "/groups", icon: Layers, label: "Grupos" },
  { href: "/messages", icon: MessageCircle, label: "DMs" },
  { href: "/notifications", icon: Bell, label: "Alertas" },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-fb-border bg-fb-white py-2 lg:hidden">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center gap-0.5 text-fb-text-secondary hover:text-fb-blue"
        >
          <item.icon className="h-5 w-5" />
          <span className="text-[10px]">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
