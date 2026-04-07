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
            padding: "24px",
          }}
        >
          <div
            style={{
              maxWidth: "1440px",
              margin: "0 auto",
              minHeight: "calc(100vh - 48px)",
              borderRadius: "28px",
              border: "1px solid rgba(138, 116, 255, 0.18)",
              background: "rgba(10, 12, 24, 0.62)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.03) inset, 0 20px 60px rgba(0,0,0,0.35)",
              backdropFilter: "blur(10px)",
              padding: "18px",
            }}
          >
            <div
              style={{
                height: "64px",
                borderRadius: "18px",
                border: "1px solid rgba(138, 116, 255, 0.16)",
                background: "rgba(17, 20, 37, 0.58)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 18px",
                marginBottom: "18px",
              }}
            >
              <div style={{ fontSize: "22px", fontWeight: 700 }}>Varna</div>

              <div
                style={{
                  width: "280px",
                  height: "42px",
                  borderRadius: "999px",
                  border: "1px solid rgba(138, 116, 255, 0.18)",
                  background: "rgba(12, 14, 28, 0.7)",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 16px",
                  color: "#8f86ae",
                }}
              >
                Rechercher...
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "240px 1fr",
                gap: "18px",
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
