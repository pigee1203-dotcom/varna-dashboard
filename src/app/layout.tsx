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
              border: "1px solid rgba(123,110,255,0.18)",
              background:
                "linear-gradient(180deg, rgba(10,12,24,0.96), rgba(8,10,18,0.92))",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.03) inset, 0 28px 90px rgba(0,0,0,0.46)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "radial-gradient(circle at 50% 0%, rgba(125,102,255,0.12), transparent 26%)",
              }}
            />

            {/* TOP BAR */}
            <div
              style={{
                height: "68px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 18px",
                borderBottom: "1px solid rgba(123,110,255,0.10)",
                background:
                  "linear-gradient(180deg, rgba(23,26,48,0.72), rgba(13,16,31,0.56))",
                position: "relative",
                zIndex: 1,
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
                    borderBottom: "20px solid #78a6ff",
                    transform: "rotate(180deg)",
                    filter: "drop-shadow(0 0 10px rgba(120,166,255,0.40))",
                  }}
                />
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: "#ece8ff",
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
                    height: "40px",
                    borderRadius: "999px",
                    border: "1px solid rgba(123,110,255,0.16)",
                    background: "rgba(9,11,24,0.72)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 18px",
                    color: "#9a93c4",
                    fontSize: "14px",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset",
                  }}
                >
                  Rechercher...
                </div>

                <div style={{ color: "#cdc6f3", fontSize: "16px" }}>⌁</div>

                <div
                  style={{
                    position: "relative",
                    width: "20px",
                    height: "20px",
                    color: "#dbd4ff",
                    fontSize: "18px",
                  }}
                >
                  🔔
                  <span
                    style={{
                      position: "absolute",
                      top: "-1px",
                      right: "-2px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "999px",
                      background: "#ff4f58",
                      boxShadow: "0 0 10px rgba(255,79,88,0.55)",
                    }}
                  />
                </div>

                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "999px",
                    border: "1px solid rgba(172,150,255,0.16)",
                    background:
                      "linear-gradient(180deg, rgba(72,58,112,0.88), rgba(48,38,82,0.86))",
                    boxShadow:
                      "0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 18px rgba(150,120,255,0.14)",
                  }}
                />
              </div>
            </div>

            {/* CONTENT */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "290px 1fr",
                gap: "18px",
                padding: "12px",
                minHeight: "calc(100vh - 68px)",
                position: "relative",
                zIndex: 1,
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
