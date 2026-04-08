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
        border: "1px solid rgba(123,110,255,0.14)",
        background:
          "linear-gradient(180deg, rgba(12,15,30,0.90), rgba(8,10,21,0.84))",
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
            "radial-gradient(circle at 3% 54%, rgba(255,152,84,0.10), transparent 12%), radial-gradient(circle at 12% 76%, rgba(145,112,255,0.12), transparent 18%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div
          style={{
            color: "#ece7ff",
            fontSize: "16px",
            fontWeight: 700,
            marginBottom: "4px",
            padding: "4px 6px 2px 6px",
          }}
        >
          Varna
        </div>

        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              style={{
                borderRadius: "18px",
                border: item.active
                  ? "1px solid rgba(209,171,255,0.22)"
                  : "1px solid rgba(123,110,255,0.12)",
                background: item.active
                  ? "linear-gradient(180deg, rgba(88,69,154,0.42), rgba(43,36,79,0.84))"
                  : "linear-gradient(180deg, rgba(28,31,59,0.84), rgba(16,19,37,0.84))",
                boxShadow: item.active
                  ? "0 0 22px rgba(212,156,255,0.12), 0 0 0 1px rgba(255,255,255,0.03) inset"
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
                  border: "1px solid rgba(200,191,255,0.14)",
                  background:
                    "linear-gradient(180deg, rgba(63,58,110,0.82), rgba(35,31,72,0.82))",
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
                    color: "#f3efff",
                    fontSize: "15px",
                    fontWeight: 600,
                    marginBottom: "4px",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    color: "#b9b1dc",
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
                    color: "#c9c1ef",
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
          width: "38px",
          height: "38px",
          borderRadius: "999px",
          border: "1px solid rgba(123,110,255,0.14)",
          background:
            "linear-gradient(180deg, rgba(28,31,59,0.92), rgba(14,16,32,0.88))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ddd6ff",
        }}
      >
        ‹
      </div>
    </aside>
  );
}
