import Link from "next/link";

const menuItems = [
  {
    title: "Inbox",
    description: "Tous vos messages\net notifications",
    href: "/inbox",
    active: true,
    icon: "✉",
  },
  {
    title: "Aujourd'hui",
    description: "Vos tâches et priorités\ndu jour",
    href: "/aujourdhui",
    icon: "415",
  },
  {
    title: "Calendrier",
    description: "Vos événements et\nrendez-vous",
    href: "/calendrier",
    icon: "24",
  },
  {
    title: "Factures",
    description: "Gérez et suivez toutes\nvos factures",
    href: "/factures",
    icon: "🧾",
  },
  {
    title: "Documents",
    description: "Stockez et retrouvez\nvos fichiers",
    href: "/documents",
    icon: "📄",
    plus: true,
  },
  {
    title: "Paramètres",
    description: "Personnalisez votre\nespace et préférences",
    href: "/parametres",
    icon: "⚙",
  },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        position: "relative",
        borderRadius: "28px",
        border: "1px solid rgba(124,112,255,0.14)",
        background:
          "linear-gradient(180deg, rgba(13,16,31,0.88), rgba(8,10,21,0.84))",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.03) inset, 0 18px 70px rgba(0,0,0,0.30)",
        overflow: "hidden",
        minHeight: "100%",
        padding: "14px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 4% 56%, rgba(255,153,83,0.10), transparent 12%), radial-gradient(circle at 12% 74%, rgba(145,112,255,0.12), transparent 18%)",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              style={{
                borderRadius: "18px",
                border: item.active
                  ? "1px solid rgba(208,170,255,0.24)"
                  : "1px solid rgba(124,112,255,0.12)",
                background: item.active
                  ? "linear-gradient(180deg, rgba(89,70,156,0.44), rgba(45,36,78,0.82))"
                  : "linear-gradient(180deg, rgba(29,32,59,0.84), rgba(17,19,37,0.82))",
                boxShadow: item.active
                  ? "0 0 22px rgba(208,157,255,0.14), 0 0 0 1px rgba(255,255,255,0.03) inset"
                  : "0 0 0 1px rgba(255,255,255,0.02) inset",
                padding: "14px",
                display: "grid",
                gridTemplateColumns: "38px 1fr auto",
                gap: "12px",
                alignItems: "start",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  border: "1px solid rgba(200,190,255,0.14)",
                  background:
                    "linear-gradient(180deg, rgba(65,59,116,0.82), rgba(35,31,72,0.82))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#f2edff",
                  fontSize: item.icon === "415" || item.icon === "24" ? "13px" : "18px",
                  fontWeight: 700,
                }}
              >
                {item.icon}
              </div>

              <div>
                <div
                  style={{
                    color: "#f2edff",
                    fontSize: "15px",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    color: "#b8b0db",
                    fontSize: "12px",
                    lineHeight: 1.45,
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.description}
                </div>
              </div>

              {item.plus ? (
                <div
                  style={{
                    color: "#c8c0ee",
                    fontSize: "18px",
                    paddingTop: "1px",
                  }}
                >
                  +
                </div>
              ) : (
                <div />
              )}
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: "18px",
          bottom: "16px",
          width: "40px",
          height: "40px",
          borderRadius: "999px",
          border: "1px solid rgba(124,112,255,0.14)",
          background:
            "linear-gradient(180deg, rgba(30,32,61,0.92), rgba(14,16,32,0.88))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#d8d1fb",
        }}
      >
        ‹
      </div>
    </aside>
  );
}
