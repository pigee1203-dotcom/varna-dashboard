import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Varna",
  description: "Dashboard Varna",
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
            padding: "10px",
          }}
        >
          <div
            style={{
              maxWidth: "1720px",
              margin: "0 auto",
              minHeight: "calc(100vh - 20px)",
              borderRadius: "34px",
              border: "1px solid rgba(124, 112, 255, 0.16)",
              background:
                "linear-gradient(180deg, rgba(10,12,24,0.96), rgba(8,10,18,0.92))",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.03) inset, 0 28px 90px rgba(0,0,0,0.45)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 18px",
                borderBottom: "1px solid rgba(124,112,255,0.10)",
                background:
                  "linear-gradient(180deg, rgba(24,26,48,0.72), rgba(14,16,30,0.56))",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "11px solid transparent",
                    borderRight: "11px solid transparent",
                    borderBottom: "20px solid #74a0ff",
                    transform: "rotate(180deg)",
                    filter: "drop-shadow(0 0 10px rgba(116,160,255,0.40))",
                  }}
                />
                <div
                  style={{
                    fontSize: "25px",
                    color: "#e9e5ff",
                    letterSpacing: "-0.02em",
                    fontWeight: 500,
                  }}
                >
                  Varna
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: "210px",
                    height: "42px",
                    borderRadius: "999px",
                    border: "1px solid rgba(124,112,255,0.16)",
                    background: "rgba(10,12,23,0.68)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 18px",
                    color: "#9a93c4",
                    fontSize: "14px",
                  }}
                >
                  Rechercher...
                </div>

                <div style={{ color: "#c9c0f7", fontSize: "18px" }}>⌁</div>

                <div
                  style={{
                    position: "relative",
                    color: "#d8cffc",
                    fontSize: "18px",
                  }}
                >
                  🔔
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "8px",
                      height: "8px",
                      borderRadius: "999px",
                      background: "#ff4e57",
                      boxShadow: "0 0 10px rgba(255,78,87,0.55)",
                    }}
                  />
                </div>

                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "999px",
                    border: "1px solid rgba(170,150,255,0.18)",
                    background:
                      "linear-gradient(180deg, rgba(72,58,112,0.88), rgba(48,38,82,0.86))",
                    boxShadow:
                      "0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 18px rgba(150,120,255,0.14)",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "285px 1fr",
                gap: "18px",
                padding: "12px",
                minHeight: "calc(100vh - 70px)",
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
