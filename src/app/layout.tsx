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
              maxWidth: "1530px",
              margin: "0 auto",
              minHeight: "calc(100vh - 36px)",
              borderRadius: "34px",
              border: "1px solid rgba(88, 84, 170, 0.30)",
              background:
                "linear-gradient(180deg, rgba(6,8,24,0.985) 0%, rgba(7,9,27,0.975) 42%, rgba(7,8,22,0.985) 100%)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.02) inset, 0 30px 90px rgba(0,0,0,0.50), 0 0 110px rgba(73,61,170,0.12)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: `
                  radial-gradient(circle at 45% 5%, rgba(121, 99, 255, 0.23), transparent 14%),
                  radial-gradient(circle at 55% 12%, rgba(83, 68, 213, 0.16), transparent 18%),
                  radial-gradient(circle at 18% 88%, rgba(255, 157, 88, 0.09), transparent 14%),
                  radial-gradient(circle at 76% 84%, rgba(133, 108, 255, 0.09), transparent 16%)
                `,
                zIndex: 0,
              }}
            />

            <div
              style={{
                position: "absolute",
                left: "-5%",
                right: "-3%",
                bottom: "1%",
                height: "280px",
                pointerEvents: "none",
                opacity: 0.70,
                zIndex: 0,
                background: `
                  radial-gradient(ellipse at 16% 78%, rgba(255,155,86,0.22), transparent 26%),
                  radial-gradient(ellipse at 34% 88%, rgba(123,104,255,0.20), transparent 30%),
                  radial-gradient(ellipse at 56% 78%, rgba(255,155,86,0.16), transparent 22%),
                  radial-gradient(ellipse at 74% 88%, rgba(123,104,255,0.18), transparent 30%)
                `,
                filter: "blur(28px)",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: "8%",
                right: "-4%",
                bottom: "4%",
                height: "200px",
                pointerEvents: "none",
                opacity: 0.58,
                zIndex: 0,
                transform: "rotate(-5deg)",
                background:
                  "radial-gradient(ellipse at center, rgba(174,131,255,0.28) 0%, rgba(127,102,255,0.16) 24%, rgba(98,77,220,0.06) 42%, transparent 70%)",
                filter: "blur(18px)",
              }}
            />

            <div
              style={{
                position: "absolute",
                left: "12%",
                right: "8%",
                bottom: "5%",
                height: "170px",
                pointerEvents: "none",
                opacity: 0.52,
                zIndex: 0,
                transform: "rotate(2deg)",
                background:
                  "radial-gradient(ellipse at center, rgba(255,168,96,0.26) 0%, rgba(255,145,80,0.14) 22%, rgba(255,145,80,0.04) 42%, transparent 70%)",
                filter: "blur(18px)",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 2,
                padding: "16px 18px 8px 18px",
              }}
            >
              <div
                style={{
                  height: "62px",
                  borderRadius: "24px",
                  border: "1px solid rgba(84, 82, 170, 0.28)",
                  background:
                    "linear-gradient(180deg, rgba(11,13,38,0.78), rgba(7,9,26,0.70))",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.02) inset, 0 12px 34px rgba(0,0,0,0.20)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 18px 0 22px",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#f3eeff",
                    opacity: 0.96,
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
                      width: "250px",
                      height: "40px",
                      borderRadius: "999px",
                      border: "1px solid rgba(92, 88, 175, 0.22)",
                      background:
                        "linear-gradient(180deg, rgba(8,10,28,0.92), rgba(6,8,21,0.88))",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.015) inset",
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
                      width: "0",
                      height: "0",
                      borderTop: "7px solid transparent",
                      borderBottom: "7px solid transparent",
                      borderLeft: "10px solid rgba(207,198,255,0.82)",
                      filter: "drop-shadow(0 0 6px rgba(170,150,255,0.18))",
                      opacity: 0.9,
                    }}
                  />

                  <div
                    style={{
                      position: "relative",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#e4dcff",
                      fontSize: "17px",
                    }}
                  >
                    🔔
                    <span
                      style={{
                        position: "absolute",
                        top: "1px",
                        right: "-1px",
                        width: "8px",
                        height: "8px",
                        borderRadius: "999px",
                        background: "#ff4f58",
                        boxShadow: "0 0 10px rgba(255,79,88,0.58)",
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
                        "linear-gradient(180deg, rgba(97,81,146,0.92), rgba(60,48,106,0.90))",
                      boxShadow:
                        "0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 18px rgba(150,120,255,0.14)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#f3edff",
                      fontSize: "15px",
                      fontWeight: 700,
                    }}
                  >
                    M
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "grid",
                gridTemplateColumns: "248px 1fr",
                gap: "18px",
                padding: "8px 18px 18px 18px",
                minHeight: "calc(100vh - 108px)",
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
