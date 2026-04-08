import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Varna Dashboard",
  description: "Interface principale Varna",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <main
          style={{
            minHeight: "100vh",
            padding: "20px",
          }}
        >
          <div
            style={{
              maxWidth: "1680px",
              margin: "0 auto",
              minHeight: "calc(100vh - 40px)",
              borderRadius: "34px",
              border: "1px solid rgba(140,120,255,0.12)",
              background:
                "linear-gradient(180deg, rgba(13,16,31,0.88), rgba(10,12,24,0.78))",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.03) inset, 0 30px 90px rgba(0,0,0,0.40)",
              backdropFilter: "blur(16px)",
              padding: "18px",
            }}
          >
            {/* TOP BAR */}
            <div
              style={{
                height: "74px",
                borderRadius: "22px",
                border: "1px solid rgba(140,120,255,0.10)",
                background: "rgba(19,23,41,0.58)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 22px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                }}
              >
                Dashboard
              </div>

              <div
                style={{
                  width: "320px",
                  height: "48px",
                  borderRadius: "999px",
                  border: "1px solid rgba(140,120,255,0.12)",
                  background: "rgba(12,15,28,0.78)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 18px",
                  color: "#8f86ae",
                  fontSize: "14px",
                }}
              >
                Rechercher...
              </div>
            </div>

            {/* BODY */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "300px 1fr",
                gap: "20px",
                minHeight: "calc(100vh - 170px)",
              }}
            >
              <Sidebar />

              <section>{children}</section>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
