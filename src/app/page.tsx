export default function DashboardPage() {
  const quickActions = [
    {
      title: "Nouvelle Tâche",
      bg: "linear-gradient(180deg, rgba(86,96,255,0.88), rgba(67,75,186,0.78))",
      icon: "+",
    },
    {
      title: "Événement",
      bg: "linear-gradient(180deg, rgba(184,99,255,0.84), rgba(135,63,198,0.76))",
      icon: "+",
    },
    {
      title: "Ajouter Facture",
      bg: "linear-gradient(180deg, rgba(197,123,173,0.84), rgba(148,85,131,0.76))",
      icon: "◧",
    },
    {
      title: "Nouvelle Note",
      bg: "linear-gradient(180deg, rgba(122,158,228,0.84), rgba(79,115,180,0.76))",
      icon: "▤",
    },
  ];

  const suggestions = [
    { icon: "🔔", text: "5 tâches en attente depuis 3 jours" },
    { icon: "💼", text: "Facture SFR bientôt due" },
    { icon: "🗓️", text: "Aucun événement aujourd'hui → Planifier ?" },
  ];

  const activities = [
    { icon: "✅", text: "Rapport final terminé il y a 12 min" },
    { icon: "📁", text: "Contrat_projet.pdf ajouté il y a 45 min" },
    { icon: "💵", text: "Paiement Facture Styles il y a 1 h" },
  ];

  const stats = [
    { title: "Inbox", value: "7", icon: "✉", accent: false },
    { title: "Aujourd'hui", value: "3", icon: "▣", accent: true },
    { title: "Factures", value: "2", icon: "▤", accent: false, sub: "En attente" },
    { title: "Docs", value: "4", icon: "▥", accent: false },
  ];

  const panelBase: React.CSSProperties = {
    borderRadius: "26px",
    border: "1px solid rgba(91, 89, 178, 0.24)",
    background: "linear-gradient(180deg, rgba(12,14,37,0.88), rgba(8,10,27,0.82))",
    boxShadow:
      "0 0 0 1px rgba(255,255,255,0.018) inset, 0 22px 50px rgba(0,0,0,0.24)",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 382px",
        gap: "18px",
        minHeight: "100%",
        alignItems: "start",
      }}
    >
      <section style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div
          style={{
            ...panelBase,
            position: "relative",
            borderRadius: "28px",
            padding: "18px 18px 16px 18px",
            overflow: "hidden",
            minHeight: "400px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(circle at 54% 2%, rgba(126,104,255,0.18), transparent 28%)",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "-5%",
              right: "-5%",
              bottom: "-6%",
              height: "210px",
              pointerEvents: "none",
              opacity: 0.88,
              background: `
                radial-gradient(ellipse at 14% 72%, rgba(255,155,82,0.14), transparent 24%),
                radial-gradient(ellipse at 42% 86%, rgba(130,108,255,0.18), transparent 28%),
                radial-gradient(ellipse at 64% 72%, rgba(255,155,82,0.10), transparent 20%),
                radial-gradient(ellipse at 82% 84%, rgba(118,100,255,0.14), transparent 28%)
              `,
              filter: "blur(20px)",
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
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: "14px",
                padding: "14px 18px",
                borderRadius: "14px",
                border: "1px solid rgba(111,105,196,0.18)",
                background:
                  "linear-gradient(180deg, rgba(28,31,68,0.88), rgba(23,26,58,0.84))",
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
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: "14px",
                padding: "14px 18px",
                borderRadius: "14px",
                border: "1px solid rgba(111,105,196,0.18)",
                background:
                  "linear-gradient(180deg, rgba(28,31,68,0.88), rgba(23,26,58,0.84))",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.015) inset",
              }}
            >
              <div style={{ fontSize: "15px", color: "#f4efff" }}>
                2.&nbsp; Payer Facture EDF en retard
              </div>

              <div
                style={{
                  minWidth: "110px",
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
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: "14px",
                padding: "14px 18px",
                borderRadius: "14px",
                border: "1px solid rgba(111,105,196,0.18)",
                background:
                  "linear-gradient(180deg, rgba(28,31,68,0.88), rgba(23,26,58,0.84))",
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
                    width: "44px",
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
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                gap: "14px",
                padding: "14px 18px",
                borderRadius: "14px",
                border: "1px solid rgba(111,105,196,0.14)",
                background:
                  "linear-gradient(180deg, rgba(22,26,58,0.82), rgba(18,22,48,0.82))",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.01) inset",
                color: "#7f78a8",
              }}
            >
              <div style={{ fontSize: "15px" }}>+&nbsp;&nbsp; Nouvelle Tâche...</div>

              <div
                style={{
                  minWidth: "110px",
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
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "16px",
                alignItems: "center",
                padding: "16px 16px 16px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(227,153,77,0.18)",
                background:
                  "linear-gradient(90deg, rgba(35,28,58,0.95) 0%, rgba(57,35,44,0.92) 58%, rgba(89,53,31,0.78) 100%)",
                overflow: "hidden",
                marginTop: "2px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "16%",
                  right: "12%",
                  bottom: "-14px",
                  height: "52px",
                  background:
                    "radial-gradient(ellipse at center, rgba(255,155,79,0.44), rgba(255,155,79,0.0) 70%)",
                  filter: "blur(6px)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ marginBottom: "8px", color: "#f6f2ff", fontSize: "15px" }}>
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
                    minWidth: "110px",
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

        <div
          style={{
            ...panelBase,
            padding: "14px 16px 16px 16px",
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
                "radial-gradient(circle at 50% 100%, rgba(118,102,255,0.10), transparent 28%)",
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
              fontSize: "18px",
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
            {stats.map((item) => (
              <div
                key={item.title}
                style={{
                  borderRadius: "15px",
                  border: "1px solid rgba(111,105,196,0.16)",
                  background: item.accent
                    ? "linear-gradient(180deg, rgba(81,68,160,0.42), rgba(24,27,57,0.84))"
                    : "linear-gradient(180deg, rgba(25,29,66,0.84), rgba(20,24,52,0.82))",
                  boxShadow: item.accent
                    ? "0 0 20px rgba(155,120,255,0.10), 0 0 0 1px rgba(255,255,255,0.015) inset"
                    : "0 0 0 1px rgba(255,255,255,0.012) inset",
                  minHeight: "102px",
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    color: "#ece4ff",
                    fontSize: "14px",
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "#d8ceff" }}>{item.icon}</span>
                  {item.title}
                </div>

                <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
                  <div
                    style={{
                      fontSize: "42px",
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
                        width: "40px",
                        height: "4px",
                        borderRadius: "999px",
                        background: "rgba(174,164,222,0.42)",
                      }}
                    />
                    <div
                      style={{
                        width: "30px",
                        height: "4px",
                        borderRadius: "999px",
                        background: item.accent
                          ? "linear-gradient(90deg, #b077ff, #7f74ff)"
                          : "rgba(174,164,222,0.22)",
                      }}
                    />
                  </div>
                </div>

                {item.sub && (
                  <div
                    style={{
                      marginTop: "2px",
                      color: "#d8cff8",
                      fontSize: "13px",
                    }}
                  >
                    {item.sub}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div
          style={{
            ...panelBase,
            padding: "16px 16px 16px 16px",
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
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <span style={{ fontSize: "18px", lineHeight: 1 }}>{item.icon}</span>
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            ...panelBase,
            padding: "16px 16px 18px 16px",
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
            {suggestions.map((item) => (
              <div
                key={item.text}
                style={{
                  borderRadius: "12px",
                  background:
                    "linear-gradient(180deg, rgba(25,29,66,0.86), rgba(20,24,52,0.84))",
                  border: "1px solid rgba(111,105,196,0.10)",
                  padding: "14px 14px",
                  color: "#efeaff",
                  lineHeight: 1.42,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            ...panelBase,
            padding: "16px 16px 18px 16px",
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
            {activities.map((item) => (
              <div
                key={item.text}
                style={{
                  borderRadius: "12px",
                  background:
                    "linear-gradient(180deg, rgba(25,29,66,0.86), rgba(20,24,52,0.84))",
                  border: "1px solid rgba(111,105,196,0.10)",
                  padding: "14px 14px",
                  color: "#efeaff",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
