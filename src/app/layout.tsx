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
            padding: "18px",
            position: "relative",
          }}
        >
          <div
            style={{
              maxWidth: "1520px",
              margin: "0 auto",
              minHeight: "calc(100vh - 36px)",
              borderRadius: "34px",
              border: "1px solid rgba(95, 92, 182, 0.26)",
              background:
                "linear-gradient(180deg, rgba(6,8,24,0.98) 0%, rgba(7,9,28,0.96) 52%, rgba(7,8,22,0.98) 100%)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.025) inset, 0 30px 90px rgba(0,0,0,0.48), 0 0 80px rgba(64,52,144,0.10)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* GLOBAL BACKGROUND LAYERS */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: `
                  radial-gradient(circle at 45% 6%, rgba(119, 95, 255, 0.20), transparent 18%),
                  radial-gradient(circle at 62% 14%, rgba(101, 84, 232, 0.12), transparent 22%),
                  radial-gradient(circle at 18% 88%, rgba(255, 157, 88, 0.09), transparent 16%),
                  radial-gradient(circle at 74% 86%, rgba(133, 108, 255, 0.09), transparent 18%)
                `,
                zIndex: 0,
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                opacity: 0.95,
                background: `
                  radial-gradient(ellipse at 30% 88%, rgba(255, 155, 82, 0.18), transparent 20%),
                  radial-gradient(ellipse at 48% 92%, rgba(125, 104, 255, 0.20), transparent 24%),
                  radial-gradient(ellipse at 68% 88%, rgba(255, 155, 82, 0.14), transparent 19%)
                `,
                filter: "blur(24px)",
                zIndex: 0,
              }}
            />

            <div
              style={{
                position: "absolute",
                left: "-4%",
                right: "-4%",
                bottom: "2%",
                height: "320px",
                pointerEvents: "none",
                opacity: 0.72,
                background: `
                  radial-gradient(ellipse at 18% 72%, rgba(255,145,79,0.24), transparent 26%),
                  radial-gradient(ellipse at 38% 85%, rgba(122,103,255,0.22), transparent 30%),
                  radial-gradient(ellipse at 58% 74%, rgba(255,145,79,0.18), transparent 24%),
                  radial-gradient(ellipse at 76% 86%, rgba(122,103,255,0.18), transparent 30%)
                `,
                filter: "blur(36px)",
                zIndex: 0,
              }}
            />

            {/* TOP BAR */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                padding: "18px 18px 8px 18px",
              }}
            >
              <div
                style={{
                  height: "62px",
                  borderRadius: "24px",
                  border: "1px solid rgba(84, 82, 170, 0.26)",
                  background:
                    "linear-gradient(180deg, rgba(12,14,37,0.76), rgba(7,9,26,0.68))",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.02) inset, 0 12px 34px rgba(0,0,0,0.22)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 20px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#f3eeff",
                    letterSpacing: "-0.03em",
                  }}
                >
                  Dashboard
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
                      width: "300px",
                      height: "42px",
                      borderRadius: "999px",
                      border: "1px solid rgba(92, 88, 175, 0.24)",
                      background:
                        "linear-gradient(180deg, rgba(8,10,28,0.86), rgba(6,8,21,0.82))",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 18px",
                      color: "#8f89b9",
                      fontSize: "14px",
                    }}
                  >
                    Rechercher...
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "grid",
                gridTemplateColumns: "282px 1fr",
                gap: "18px",
                padding: "8px 18px 18px 18px",
                minHeight: "calc(100vh - 110px)",
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
