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
              border: "1px solid rgba(128, 114, 255, 0.18)",
              background:
                "linear-gradient(180deg, rgba(10,12,25,0.94), rgba(8,10,20,0.90))",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.03) inset, 0 28px 90px rgba(0,0,0,0.42)",
              overflow: "hidden",
            }}
          >
            {/* top bar */}
            <div
              style={{
                height: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 22px 0 22px",
                borderBottom: "1px solid rgba(128, 114, 255, 0.10)",
                background:
                  "linear-gradient(180deg, rgba(21,24,46,0.72), rgba(14,16,31,0.58))",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: "0",
                    height: "0",
                    borderLeft: "13px solid transparent",
                    borderRight: "13px solid transparent",
                    borderBottom: "22px solid #78a1ff",
                    transform: "rotate(180deg)",
                    filter: "drop-shadow(0 0 12px rgba(120,161,255,0.35))",
                  }}
                />
                <div
                  style={{
                    fontSize: "26px",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    color: "#e8e4ff",
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
                    border: "1px solid rgba(128,114,255,0.16)",
                    background: "rgba(10,12,25,0.66)",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 18px",
                    color: "#9f97c9",
                    fontSize: "14px",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset",
                  }}
                >
                  Rechercher...
                </div>

                <div style={{ color: "#c9c0f7", fontSize: "18px" }}>⌁</div>
                <div style={{ color: "#c9c0f7", fontSize: "20px", position: "relative" }}>
                  🔔
                  <span
                    style={{
                      position: "absolute",
                      top: "-2px",
                      right: "-1px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "999px",
                      background: "#ff4e57",
                      boxShadow: "0 0 10px rgba(255,78,87,0.5)",
                    }}
                  />
                </div>

                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "999px",
                    border: "1px solid rgba(170,150,255,0.22)",
                    background:
                      "linear-gradient(180deg, rgba(70,53,107,0.85), rgba(47,37,82,0.88))",
                    boxShadow:
                      "0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 18px rgba(153,121,255,0.16)",
                  }}
                />
              </div>
            </div>

            {/* content */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "290px 1fr",
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
