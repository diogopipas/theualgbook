import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "theUALGbook",
  description: "A rede social da Universidade do Algarve",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
