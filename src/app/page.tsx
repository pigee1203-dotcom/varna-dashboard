export default function DashboardPage() {
  return (
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
        {/* Top bar */}
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

        {/* Main content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "240px 1fr 360px",
            gap: "18px",
            minHeight: "calc(100vh - 170px)",
          }}
        >
          {/* Sidebar */}
          <aside
            style={{
              borderRadius: "24px",
              border: "1px solid rgba(138, 116, 255, 0.18)",
              background: "rgba(16, 19, 34, 0.66)",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Menu
            </div>

            {[
              "Inbox",
              "Aujourd’hui",
              "Calendrier",
              "Factures",
              "Documents",
              "Paramètres",
            ].map((item) => (
              <div
                key={item}
                style={{
                  borderRadius: "18px",
                  border: "1px solid rgba(138, 116, 255, 0.16)",
                  background:
                    item === "Inbox"
                      ? "linear-gradient(180deg, rgba(143,108,255,0.18), rgba(255,166,92,0.08))"
                      : "rgba(22, 25, 45, 0.72)",
                  padding: "14px 14px",
                  color: "#f5f2ff",
                }}
              >
                <div style={{ fontWeight: 600 }}>{item}</div>
              </div>
            ))}

            <div style={{ flex: 1 }} />
          </aside>

          {/* Center */}
          <section style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              style={{
                borderRadius: "24px",
                border: "1px solid rgba(138, 116, 255, 0.18)",
                background: "rgba(18, 22, 40, 0.68)",
                padding: "18px",
                minHeight: "320px",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>
                Priorité Immédiate
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "16px",
                    background: "rgba(27, 31, 55, 0.82)",
                    border: "1px solid rgba(138, 116, 255, 0.12)",
                  }}
                >
                  1. Préparer la présentation client
                </div>

                <div
                  style={{
                    padding: "16px",
                    borderRadius: "16px",
                    background: "rgba(27, 31, 55, 0.82)",
                    border: "1px solid rgba(138, 116, 255, 0.12)",
                  }}
                >
                  2. Payer Facture EDF en retard
                </div>

                <div
                  style={{
                    padding: "16px",
                    borderRadius: "16px",
                    background: "rgba(27, 31, 55, 0.82)",
                    border: "1px solid rgba(138, 116, 255, 0.12)",
                  }}
                >
                  3. Réserver restaurant 20:00
                </div>

                <div
                  style={{
                    padding: "16px",
                    borderRadius: "16px",
                    background:
                      "linear-gradient(90deg, rgba(41,31,54,0.72), rgba(88,46,24,0.28))",
                    border: "1px solid rgba(242, 163, 94, 0.18)",
                  }}
                >
                  Facture Internet bientôt due - 2 jours
                </div>
              </div>
            </div>

            <div
              style={{
                borderRadius: "24px",
                border: "1px solid rgba(138, 116, 255, 0.18)",
                background: "rgba(18, 22, 40, 0.68)",
                padding: "18px",
                minHeight: "140px",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>
                Vision Globale
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "14px",
                }}
              >
                {["Inbox", "Aujourd’hui", "Factures", "Docs"].map((item) => (
                  <div
                    key={item}
                    style={{
                      borderRadius: "16px",
                      padding: "16px",
                      background: "rgba(27, 31, 55, 0.82)",
                      border: "1px solid rgba(138, 116, 255, 0.12)",
                    }}
                  >
                    <div style={{ color: "#c6bddf", marginBottom: "10px" }}>{item}</div>
                    <div style={{ fontSize: "18px", fontWeight: 700 }}>0</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right */}
          <aside style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              style={{
                borderRadius: "24px",
                border: "1px solid rgba(138, 116, 255, 0.18)",
                background: "rgba(18, 22, 40, 0.68)",
                padding: "18px",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>
                Quick Actions
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                {[
                  "Nouvelle Tâche",
                  "Événement",
                  "Ajouter Facture",
                  "Nouvelle Note",
                ].map((item, i) => (
                  <div
                    key={item}
                    style={{
                      borderRadius: "14px",
                      padding: "14px",
                      textAlign: "center",
                      fontWeight: 600,
                      border: "1px solid rgba(138, 116, 255, 0.14)",
                      background:
                        i === 0
                          ? "rgba(95, 92, 255, 0.35)"
                          : i === 1
                          ? "rgba(171, 85, 255, 0.35)"
                          : i === 2
                          ? "rgba(203, 111, 163, 0.35)"
                          : "rgba(96, 146, 219, 0.35)",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                borderRadius: "24px",
                border: "1px solid rgba(138, 116, 255, 0.18)",
                background: "rgba(18, 22, 40, 0.68)",
                padding: "18px",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>
                Smart Suggestions
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "14px",
                    background: "rgba(27, 31, 55, 0.82)",
                  }}
                >
                  5 tâches en attente depuis 3 jours
                </div>
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "14px",
                    background: "rgba(27, 31, 55, 0.82)",
                  }}
                >
                  Facture SFR bientôt due
                </div>
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "14px",
                    background: "rgba(27, 31, 55, 0.82)",
                  }}
                >
                  Aucun événement aujourd’hui → Planifier ?
                </div>
              </div>
            </div>

            <div
              style={{
                borderRadius: "24px",
                border: "1px solid rgba(138, 116, 255, 0.18)",
                background: "rgba(18, 22, 40, 0.68)",
                padding: "18px",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>
                Activité Récente
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "14px",
                    background: "rgba(27, 31, 55, 0.82)",
                  }}
                >
                  Rapport final terminé il y a 12 min
                </div>
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "14px",
                    background: "rgba(27, 31, 55, 0.82)",
                  }}
                >
                  Contrat_projet.pdf ajouté il y a 45 min
                </div>
                <div
                  style={{
                    padding: "14px",
                    borderRadius: "14px",
                    background: "rgba(27, 31, 55, 0.82)",
                  }}
                >
                  Paiement Facture Styles il y a 1 h
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
