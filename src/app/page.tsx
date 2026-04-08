export default function DashboardPage() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 360px",
        gap: "18px",
        minHeight: "100%",
      }}
    >
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
  );
}
