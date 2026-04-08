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
              border: "1px solid rgba(95, 92, 182, 0.28)",
              background:
                "linear-gradient(180deg, rgba(5,7,23,0.985) 0%, rgba(6,8,26,0.975) 46%, rgba(7,8,22,0.985) 100%)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.025) inset, 0 30px 90px rgba(0,0,0,0.50), 0 0 100px rgba(64,52,144,0.12)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* DEEP TOP GLOW */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 0,
                background: `
                  radial-gradient(circle at 46% 7%, rgba(119, 95, 255, 0.28), transparent 14%),
                  radial-gradient(circle at 58% 12%, rgba(92, 77, 220, 0.16), transparent 18%),
                  radial-gradient(circle at 22% 88%, rgba(255, 157, 88, 0.10), transparent 15%),
                  radial-gradient(circle at 76% 84%, rgba(133, 108, 255, 0.10), transparent 17%)
                `,
              }}
            />

            {/* MID ATMOSPHERE */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 0,
                opacity: 0.95,
                background: `
                  radial-gradient(ellipse at 28% 86%, rgba(255, 155, 82, 0.16), transparent 20%),
                  radial-gradient(ellipse at 48% 90%, rgba(125, 104, 255, 0.20), transparent 24%),
                  radial-gradient(ellipse at 70% 86%, rgba(255, 155, 82, 0.13), transparent 18%)
                `,
                filter: "blur(28px)",
              }}
            />

            {/* LONG LOWER WAVE 1 */}
            <div
              style={{
                position: "absolute",
                left: "8%",
                right: "-2%",
                bottom: "1.5%",
                height: "230px",
                pointerEvents: "none",
                zIndex: 0,
                opacity: 0.65,
                transform: "rotate(-6deg)",
                background:
                  "radial-gradient(ellipse at center, rgba(182,132,255,0.28) 0%, rgba(136,102,255,0.18) 24%, rgba(90,70,210,0.08) 40%, transparent 68%)",
                filter: "blur(18px)",
              }}
            />

            {/* LONG LOWER WAVE 2 */}
            <div
              style={{
                position: "absolute",
                left: "10%",
                right: "4%",
                bottom: "3.5%",
                height: "180px",
                pointerEvents: "none",
                zIndex: 0,
                opacity: 0.70,
                transform: "rotate(2deg)",
                background:
                  "radial-gradient(ellipse at center, rgba(255,168,96,0.26) 0%, rgba(255,145,80,0.16) 22%, rgba(255,145,80,0.06) 40%, transparent 68%)",
                filter: "blur(20px)",
              }}
            />

            {/* LONG LOWER WAVE 3 */}
            <div
              style={{
                position: "absolute",
                left: "20%",
                right: "-6%",
                bottom: "0%",
                height: "210px",
                pointerEvents: "none",
                zIndex: 0,
                opacity: 0.62,
                transform: "rotate(8deg)",
                background:
                  "radial-gradient(ellipse at center, rgba(160,120,255,0.24) 0%, rgba(120,98,255,0.16) 24%, rgba(120,98,255,0.05) 42%, transparent 70%)",
                filter: "blur(22px)",
              }}
            />

            {/* LONG LOWER WAVE 4 */}
            <div
              style={{
                position: "absolute",
                left: "-2%",
                right: "28%",
                bottom: "4.5%",
                height: "150px",
                pointerEvents: "none",
                zIndex: 0,
                opacity: 0.45,
                transform: "rotate(-10deg)",
                background:
                  "radial-gradient(ellipse at center, rgba(255,160,88,0.22) 0%, rgba(255,160,88,0.12) 24%, rgba(255,160,88,0.04) 42%, transparent 70%)",
                filter: "blur(18px)",
              }}
            />

            {/* SPARK GLOW */}
            <div
              style={{
                position: "absolute",
                left: "14%",
                bottom: "8%",
                width: "280px",
                height: "120px",
                pointerEvents: "none",
                zIndex: 0,
                opacity: 0.55,
                background:
                  "radial-gradient(ellipse at center, rgba(255,166,92,0.34), rgba(255,166,92,0.0) 70%)",
                filter: "blur(24px)",
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
                  height: "64px",
                  borderRadius: "24px",
                  border: "1px solid rgba(84, 82, 170, 0.28)",
                  background:
                    "linear-gradient(180deg, rgba(11,13,38,0.80), rgba(7,9,26,0.70))",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.02) inset, 0 12px 34px rgba(0,0,0,0.20), 0 0 26px rgba(86,72,194,0.08)",
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
                      width: "320px",
                      height: "44px",
                      borderRadius: "999px",
                      border: "1px solid rgba(92, 88, 175, 0.24)",
                      background:
                        "linear-gradient(180deg, rgba(8,10,28,0.90), rgba(6,8,21,0.86))",
                      boxShadow:
                        "0 0 0 1px rgba(255,255,255,0.02) inset, 0 0 24px rgba(67,54,170,0.06)",
                      display: "flex",
                      alignItems: "center",
                      padding: "0 18px",
                      color: "#8f89b9",
                      fontSize: "14px",
                    }}
                  >
                    Rechercher...
                  </div>

                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderLeft: "2px solid #b8b1de",
                      borderBottom: "2px solid #b8b1de",
                      transform: "rotate(45deg)",
                      opacity: 0.7,
                      marginLeft: "-52px",
                      marginRight: "18px",
                    }}
                  />

                  <div
                    style={{
                      position: "relative",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#e4dcff",
                      fontSize: "18px",
                    }}
                  >
                    🔔
                    <span
                      style={{
                        position: "absolute",
                        top: "1px",
                        right: "2px",
                        width: "8px",
                        height: "8px",
                        borderRadius: "999px",
                        background: "#ff4f58",
                        boxShadow: "0 0 12px rgba(255,79,88,0.58)",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "999px",
                      border: "1px solid rgba(172,150,255,0.20)",
                      background:
                        "linear-gradient(180deg, rgba(84,68,128,0.90), rgba(51,40,92,0.88))",
                      boxShadow:
                        "0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 20px rgba(150,120,255,0.14)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#f3edff",
                      fontSize: "16px",
                      fontWeight: 700,
                    }}
                  >
                    M
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
                minHeight: "calc(100vh - 112px)",
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
