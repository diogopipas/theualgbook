import { Header } from "@/components/layout/header";
import { SidebarLeft } from "@/components/layout/sidebar-left";
import { SidebarRight } from "@/components/layout/sidebar-right";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-fb-gray-bg">
      <Header />
      <SidebarLeft />
      <main className="mx-auto max-w-[680px] px-4 pt-[36px] pb-4 lg:ml-[204px] xl:mr-[204px] xl:ml-[204px] xl:max-w-none">
        {children}
        <footer
          style={{
            marginTop: "16px",
            paddingTop: "8px",
            borderTop: "1px solid #ccc",
            textAlign: "center",
            fontSize: "10px",
            fontFamily: "Arial, sans-serif",
            color: "#999",
            paddingBottom: "16px",
          }}
        >
          theUALGbook © {new Date().getFullYear()} &nbsp;·&nbsp; Fundado por{" "}
          <span style={{ fontWeight: "bold", color: "#555" }}>Diogo Zuckerberg e Martim Saverino</span>
          &nbsp;·&nbsp; Universidade do Algarve
        </footer>
      </main>
      <SidebarRight />
      <MobileNav />
    </div>
  );
}
