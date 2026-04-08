export default function DashboardPage() {
  const quickActions = [
    {
      title: "Nouvelle Tâche",
      bg: "linear-gradient(180deg, rgba(86,96,255,0.78), rgba(67,75,186,0.72))",
    },
    {
      title: "Événement",
      bg: "linear-gradient(180deg, rgba(184,99,255,0.74), rgba(135,63,198,0.70))",
    },
    {
      title: "Ajouter Facture",
      bg: "linear-gradient(180deg, rgba(197,123,173,0.76), rgba(148,85,131,0.72))",
    },
    {
      title: "Nouvelle Note",
      bg: "linear-gradient(180deg, rgba(122,158,228,0.76), rgba(79,115,180,0.72))",
    },
  ];

  const suggestions = [
    "5 tâches en attente depuis 3 jours",
    "Facture SFR bientôt due",
    "Aucun événement aujourd'hui → Planifier ?",
  ];

  const activities = [
    "Rapport final terminé il y a 12 min",
    "Contrat_projet.pdf ajouté il y a 45 min",
    "Paiement Facture Styles il y a 1 h",
  ];

  const stats = [
    { title: "Inbox", value: "7", accent: false },
    { title: "Aujourd'hui", value: "3", accent: true },
    { title: "Factures", value: "2", accent: false },
    { title: "Docs", value: "4", accent: false },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 372px",
        gap: "18px",
        minHeight: "100%",
        alignItems: "start",
      }}
    >
      <section style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {/* PRIORITE IMMEDIATE */}
        <div
          style={{
            position: "relative",
            borderRadius: "28px",
            border: "1px solid rgba(91, 89, 178, 0.24)",
            background:
              "linear-gradient(180deg, rgba(12,14,37,0.88), rgba(8,10,27,0.84))",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.02) inset, 0 24px 60px rgba(0,0,0,0.26)",
            padding: "18px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(circle at 52% 0%, rgba(125,104,255,0.16), transparent 28%)",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "18%",
              right: "12%",
              bottom: "-4%",
              height: "180px",
              pointerEvents: "none",
              opacity: 0.95,
              background: `
                radial-gradient(ellipse at 18% 64%, rgba(255,155,82,0.14), transparent 24%),
                radial-gradient(ellipse at 48% 80%, rgba(130,108,255,0.16), transparent 28%),
                radial-gradient(ellipse at 74% 68%, rgba(255,155,82,0.10), transparent 22%)
              `,
              filter: "blur(22px)",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "999px",
                  background: "#ff5e57",
                  boxShadow: "0 0 12px rgba(255,94,87,0.48)",
                }}
              />
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#f4efff" }}>
                Priorité Immédiate
              </div>
            </div>

            <div style={{ display: "flex", gap: "7px" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "999px",
                    background: "rgba(191,183,255,0.72)",
                  }}
                />
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(111,105,196,0.18)",
                background:
                  "linear-gradient(180deg, rgba(26,30,67,0.84), rgba(22,25,58,0.82))",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.015) inset",
              }}
            >
              <div style={{ fontSize: "15px", color: "#f4efff" }}>
                1.&nbsp; Préparer la présentation client
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ color: "#8af285", fontSize: "20px" }}>✓</span>
                <span style={{ color: "#ff6666", fontSize: "18px" }}>▦</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(111,105,196,0.18)",
                background:
                  "linear-gradient(180deg, rgba(26,30,67,0.84), rgba(22,25,58,0.82))",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.015) inset",
              }}
            >
              <div style={{ fontSize: "15px", color: "#f4efff" }}>
                2.&nbsp; Payer Facture EDF en retard
              </div>

              <div
                style={{
                  minWidth: "84px",
                  textAlign: "center",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  background: "linear-gradient(180deg, #d94b64, #b93349)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "14px",
                  boxShadow: "0 10px 20px rgba(185,50,73,0.22)",
                }}
              >
                Payer
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(111,105,196,0.18)",
                background:
                  "linear-gradient(180deg, rgba(26,30,67,0.84), rgba(22,25,58,0.82))",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.015) inset",
              }}
            >
              <div style={{ fontSize: "15px", color: "#f4efff" }}>
                3.&nbsp; Réserver restaurant 20:00
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "16px", color: "#f6f2ff" }}>145 €</span>
                <div
                  style={{
                    width: "40px",
                    height: "32px",
                    borderRadius: "10px",
                    border: "1px solid rgba(120,111,206,0.22)",
                    background: "rgba(53,43,92,0.86)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#e8deff",
                  }}
                >
                  ˅
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(111,105,196,0.16)",
                background:
                  "linear-gradient(180deg, rgba(24,28,61,0.80), rgba(19,22,51,0.80))",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.01) inset",
                color: "#7f78a8",
              }}
            >
              <div style={{ fontSize: "15px" }}>+&nbsp;&nbsp; Nouvelle Tâche...</div>

              <div
                style={{
                  minWidth: "84px",
                  textAlign: "center",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  background: "linear-gradient(180deg, #e4a054, #c47c2d)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "14px",
                  boxShadow: "0 10px 20px rgba(196,124,45,0.20)",
                }}
              >
                Payer
              </div>
            </div>

            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(227,153,77,0.18)",
                background:
                  "linear-gradient(90deg, rgba(35,28,58,0.95) 0%, rgba(57,35,44,0.92) 58%, rgba(89,53,31,0.78) 100%)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "16%",
                  right: "12%",
                  bottom: "-14px",
                  height: "48px",
                  background:
                    "radial-gradient(ellipse at center, rgba(255,155,79,0.42), rgba(255,155,79,0.0) 70%)",
                  filter: "blur(6px)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ marginBottom: "8px", color: "#f6f2ff" }}>
                  <span style={{ color: "#f0b451", marginRight: "8px" }}>▮</span>
                  Facture Internet bientôt due − 2 jours
                </div>

                <div
                  style={{
                    display: "inline-block",
                    padding: "7px 12px",
                    borderRadius: "8px",
                    border: "1px solid rgba(234,165,82,0.20)",
                    background: "rgba(53,31,37,0.72)",
                    color: "#efe6ff",
                    fontSize: "13px",
                  }}
                >
                  Paiement dans 2 jours
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#f4efff" }}>
                  89 €
                </div>

                <div
                  style={{
                    minWidth: "84px",
                    textAlign: "center",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    background: "linear-gradient(180deg, #e4a054, #c47c2d)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "14px",
                    boxShadow: "0 10px 22px rgba(196,124,45,0.20)",
                  }}
                >
                  Payer
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VISION GLOBALE */}
        <div
          style={{
            borderRadius: "26px",
            border: "1px solid rgba(91, 89, 178, 0.24)",
            background:
              "linear-gradient(180deg, rgba(12,14,37,0.84), rgba(8,10,27,0.80))",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.02) inset, 0 22px 50px rgba(0,0,0,0.22)",
            padding: "16px 18px 18px 18px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(circle at 50% 100%, rgba(118,102,255,0.10), transparent 26%)",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              marginBottom: "14px",
              color: "#e7deff",
              fontWeight: 700,
              fontSize: "20px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <span style={{ color: "#8f85bc" }}>→</span>
            <span>Vision Globale</span>
            <span style={{ color: "#8f85bc" }}>←</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
              position: "relative",
              zIndex: 1,
            }}
          >
            {stats.map((item, i) => (
              <div
                key={item.title}
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(111,105,196,0.16)",
                  background: item.accent
                    ? "linear-gradient(180deg, rgba(72,61,142,0.36), rgba(24,27,57,0.82))"
                    : "linear-gradient(180deg, rgba(25,29,66,0.82), rgba(20,24,52,0.80))",
                  boxShadow: item.accent
                    ? "0 0 18px rgba(155,120,255,0.08), 0 0 0 1px rgba(255,255,255,0.015) inset"
                    : "0 0 0 1px rgba(255,255,255,0.012) inset",
                  minHeight: "98px",
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    color: "#ece4ff",
                    fontSize: "15px",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "#d8ceff" }}>▣</span>
                  {item.title}
                </div>

                <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
                  <div
                    style={{
                      fontSize: "44px",
                      lineHeight: 1,
                      fontWeight: 500,
                      color: "#f4efff",
                    }}
                  >
                    {item.value}
                  </div>

                  <div
                    style={{
                      marginBottom: "8px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "42px",
                        height: "4px",
                        borderRadius: "999px",
                        background: "rgba(174,164,222,0.42)",
                      }}
                    />
                    <div
                      style={{
                        width: "32px",
                        height: "4px",
                        borderRadius: "999px",
                        background: item.accent
                          ? "linear-gradient(90deg, #b077ff, #7f74ff)"
                          : "rgba(174,164,222,0.22)",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN */}
      <aside style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {/* QUICK ACTIONS */}
        <div
          style={{
            borderRadius: "26px",
            border: "1px solid rgba(91, 89, 178, 0.24)",
            background:
              "linear-gradient(180deg, rgba(12,14,37,0.84), rgba(8,10,27,0.80))",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.02) inset, 0 22px 50px rgba(0,0,0,0.22)",
            padding: "16px 18px 18px 18px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#f4efff" }}>
              Quick Actions
            </div>

            <div style={{ display: "flex", gap: "7px" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: "rgba(191,183,255,0.72)",
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {quickActions.map((item) => (
              <div
                key={item.title}
                style={{
                  borderRadius: "12px",
                  padding: "16px 14px",
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "#f8f4ff",
                  background: item.bg,
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 10px 22px rgba(0,0,0,0.18)",
                  textAlign: "center",
                }}
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>

        {/* SMART SUGGESTIONS */}
        <div
          style={{
            borderRadius: "26px",
            border: "1px solid rgba(91, 89, 178, 0.24)",
            background:
              "linear-gradient(180deg, rgba(12,14,37,0.84), rgba(8,10,27,0.80))",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.02) inset, 0 22px 50px rgba(0,0,0,0.22)",
            padding: "16px 18px 18px 18px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#f4efff" }}>
              Smart Suggestions
            </div>
            <div style={{ fontSize: "14px", color: "#b7afd8" }}>Voir Tout</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {suggestions.map((text, i) => (
              <div
                key={text}
                style={{
                  borderRadius: "14px",
                  background:
                    "linear-gradient(180deg, rgba(25,29,66,0.84), rgba(20,24,52,0.82))",
                  border: "1px solid rgba(111,105,196,0.10)",
                  padding: "15px 14px",
                  color: "#efeaff",
                  lineHeight: 1.45,
                }}
              >
                <span style={{ marginRight: "10px" }}>
                  {i === 0 ? "🔔" : i === 1 ? "💼" : "🗓️"}
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVITE RECENTE */}
        <div
          style={{
            borderRadius: "26px",
            border: "1px solid rgba(91, 89, 178, 0.24)",
            background:
              "linear-gradient(180deg, rgba(12,14,37,0.84), rgba(8,10,27,0.80))",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.02) inset, 0 22px 50px rgba(0,0,0,0.22)",
            padding: "16px 18px 18px 18px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "14px",
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#f4efff" }}>
              Activité Récente
            </div>

            <div style={{ display: "flex", gap: "7px" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: "rgba(191,183,255,0.72)",
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {activities.map((text, i) => (
              <div
                key={text}
                style={{
                  borderRadius: "12px",
                  background:
                    "linear-gradient(180deg, rgba(25,29,66,0.84), rgba(20,24,52,0.82))",
                  border: "1px solid rgba(111,105,196,0.10)",
                  padding: "14px 14px",
                  color: "#efeaff",
                }}
              >
                <span style={{ marginRight: "10px" }}>
                  {i === 0 ? "✅" : i === 1 ? "📁" : "💵"}
                </span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
