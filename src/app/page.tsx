export default function DashboardPage() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 360px",
        gap: "18px",
        minHeight: "100%",
        alignItems: "start",
      }}
    >
      <section style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div
          style={{
            position: "relative",
            borderRadius: "28px",
            border: "1px solid rgba(123, 110, 255, 0.20)",
            background:
              "linear-gradient(180deg, rgba(18,20,42,0.88), rgba(15,17,36,0.80))",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03) inset, 0 18px 50px rgba(0,0,0,0.28)",
            padding: "18px 18px 20px 18px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(circle at 52% 0%, rgba(134,110,255,0.20), transparent 30%)",
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
                  boxShadow: "0 0 10px rgba(255,94,87,0.45)",
                }}
              />
              <div style={{ fontSize: "18px", fontWeight: 700 }}>Priorité Immédiate</div>
            </div>

            <div style={{ display: "flex", gap: "7px" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "999px",
                    background: "rgba(191,183,255,0.7)",
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(132,114,255,0.14)",
                background: "rgba(28,31,61,0.82)",
              }}
            >
              <div style={{ fontSize: "15px" }}>1. Préparer la présentation client</div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ color: "#87ec7b", fontSize: "20px" }}>✓</span>
                <span style={{ color: "#ff5e57", fontSize: "18px" }}>▦</span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
                borderRadius: "14px",
                border: "1px solid rgba(132,114,255,0.14)",
                background: "rgba(28,31,61,0.82)",
              }}
            >
              <div style={{ fontSize: "15px" }}>2. Payer Facture EDF en retard</div>
              <div
                style={{
                  minWidth: "78px",
                  textAlign: "center",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  background: "linear-gradient(180deg, #d94b64, #b93249)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "14px",
                  boxShadow: "0 10px 18px rgba(185,50,73,0.22)",
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
                border: "1px solid rgba(132,114,255,0.14)",
                background: "rgba(28,31,61,0.82)",
              }}
            >
              <div style={{ fontSize: "15px" }}>3. Réserver restaurant 20:00</div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "16px", color: "#f6f2ff" }}>145 €</span>
                <div
                  style={{
                    width: "40px",
                    height: "32px",
                    borderRadius: "10px",
                    border: "1px solid rgba(140,120,255,0.18)",
                    background: "rgba(53,43,92,0.85)",
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
                border: "1px solid rgba(132,114,255,0.14)",
                background: "rgba(28,31,61,0.82)",
                color: "#7f78a8",
              }}
            >
              <div style={{ fontSize: "15px" }}>+&nbsp;&nbsp;Nouvelle Tâche...</div>
              <div
                style={{
                  minWidth: "78px",
                  textAlign: "center",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  background: "linear-gradient(180deg, #e4a054, #c47c2d)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "14px",
                  boxShadow: "0 10px 18px rgba(196,124,45,0.22)",
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
                border: "1px solid rgba(232,157,79,0.18)",
                background:
                  "linear-gradient(90deg, rgba(35,28,58,0.92) 0%, rgba(60,35,39,0.88) 55%, rgba(88,51,31,0.72) 100%)",
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
                    "radial-gradient(ellipse at center, rgba(255,155,79,0.45), rgba(255,155,79,0.0) 70%)",
                  filter: "blur(6px)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ marginBottom: "8px", color: "#f6f2ff" }}>
                  <span style={{ color: "#f0b451", marginRight: "8px" }}>▮</span>
                  Facture Internet bientôt due - 2 jours
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

              <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: "18px", fontWeight: 700 }}>89 €</div>
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
                    boxShadow: "0 10px 18px rgba(196,124,45,0.22)",
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
            borderRadius: "26px",
            border: "1px solid rgba(123, 110, 255, 0.18)",
            background:
              "linear-gradient(180deg, rgba(17,20,41,0.82), rgba(15,17,35,0.74))",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03) inset, 0 18px 50px rgba(0,0,0,0.22)",
            padding: "16px 18px 18px 18px",
          }}
        >
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
              borderRadius: "18px",
              border: "1px solid rgba(132,114,255,0.14)",
              background: "rgba(28,31,61,0.72)",
              overflow: "hidden",
            }}
          >
            {[
              { title: "Inbox", value: "7" },
              { title: "Aujourd'hui", value: "3" },
              { title: "Factures", value: "2" },
              { title: "Docs", value: "4" },
            ].map((item, i) => (
              <div
                key={item.title}
                style={{
                  padding: "16px 18px",
                  borderRight: i !== 3 ? "1px solid rgba(132,114,255,0.12)" : "none",
                  minHeight: "112px",
                  background:
                    i === 1
                      ? "linear-gradient(180deg, rgba(80,70,148,0.18), rgba(28,31,61,0.72))"
                      : "transparent",
                }}
              >
                <div
                  style={{
                    color: "#e8e1ff",
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
                  <div style={{ fontSize: "56px", lineHeight: 1, fontWeight: 500 }}>{item.value}</div>
                  <div style={{ marginBottom: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div
                      style={{
                        width: "46px",
                        height: "4px",
                        borderRadius: "999px",
                        background: "rgba(174,164,222,0.5)",
                      }}
                    />
                    <div
                      style={{
                        width: "34px",
                        height: "4px",
                        borderRadius: "999px",
                        background:
                          i === 1
                            ? "linear-gradient(90deg, #b077ff, #7f74ff)"
                            : "rgba(174,164,222,0.25)",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <aside style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        <div
          style={{
            borderRadius: "26px",
            border: "1px solid rgba(123,110,255,0.18)",
            background:
              "linear-gradient(180deg, rgba(17,20,41,0.82), rgba(15,17,35,0.74))",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03) inset, 0 18px 50px rgba(0,0,0,0.22)",
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
            <div style={{ fontSize: "18px", fontWeight: 700 }}>Quick Actions</div>
            <div style={{ display: "flex", gap: "7px" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: "rgba(191,183,255,0.7)",
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              {
                title: "Nouvelle Tâche",
                bg: "linear-gradient(180deg, rgba(84,100,255,0.62), rgba(67,77,192,0.58))",
              },
              {
                title: "Événement",
                bg: "linear-gradient(180deg, rgba(165,86,255,0.62), rgba(128,60,194,0.58))",
              },
              {
                title: "Ajouter Facture",
                bg: "linear-gradient(180deg, rgba(193,113,165,0.62), rgba(144,79,128,0.58))",
              },
              {
                title: "Nouvelle Note",
                bg: "linear-gradient(180deg, rgba(110,156,220,0.62), rgba(74,112,178,0.58))",
              },
            ].map((item) => (
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
                  boxShadow: "0 10px 20px rgba(0,0,0,0.18)",
                  textAlign: "center",
                }}
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            borderRadius: "26px",
            border: "1px solid rgba(123,110,255,0.18)",
            background:
              "linear-gradient(180deg, rgba(17,20,41,0.82), rgba(15,17,35,0.74))",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03) inset, 0 18px 50px rgba(0,0,0,0.22)",
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
            <div style={{ fontSize: "18px", fontWeight: 700 }}>Smart Suggestions</div>
            <div style={{ fontSize: "14px", color: "#b7afd8" }}>Voir Tout</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              "5 tâches en attente depuis 3 jours",
              "Facture SFR bientôt due",
              "Aucun événement aujourd'hui → Planifier ?",
            ].map((text, i) => (
              <div
                key={text}
                style={{
                  borderRadius: "14px",
                  background: "rgba(28,31,61,0.82)",
                  border: "1px solid rgba(132,114,255,0.10)",
                  padding: "15px 14px",
                  color: "#efeaff",
                  lineHeight: 1.45,
                }}
              >
                <span style={{ marginRight: "10px" }}>{i === 0 ? "🔔" : i === 1 ? "💼" : "🗓️"}</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            borderRadius: "26px",
            border: "1px solid rgba(123,110,255,0.18)",
            background:
              "linear-gradient(180deg, rgba(17,20,41,0.82), rgba(15,17,35,0.74))",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.03) inset, 0 18px 50px rgba(0,0,0,0.22)",
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
            <div style={{ fontSize: "18px", fontWeight: 700 }}>Activité Récente</div>
            <div style={{ display: "flex", gap: "7px" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: "rgba(191,183,255,0.7)",
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              "Rapport final terminé il y a 12 min",
              "Contrat_projet.pdf ajouté il y a 45 min",
              "Paiement Facture Styles il y a 1 h",
            ].map((text, i) => (
              <div
                key={text}
                style={{
                  borderRadius: "12px",
                  background: "rgba(28,31,61,0.82)",
                  border: "1px solid rgba(132,114,255,0.10)",
                  padding: "14px 14px",
                  color: "#efeaff",
                }}
              >
                <span style={{ marginRight: "10px" }}>{i === 0 ? "✅" : i === 1 ? "📁" : "💵"}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
