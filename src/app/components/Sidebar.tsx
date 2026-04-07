import Link from "next/link";

const menuItems = [
  {
    title: "Inbox",
    description: "Tous vos messages et tâches centralisées",
    href: "/inbox",
  },
  {
    title: "Aujourd’hui",
    description: "Vos tâches et priorités du jour",
    href: "/aujourdhui",
  },
  {
    title: "Calendrier",
    description: "Vos événements et rendez-vous",
    href: "/calendrier",
  },
  {
    title: "Factures",
    description: "Gérez et suivez toutes vos factures",
    href: "/factures",
  },
  {
    title: "Documents",
    description: "Stockez et retrouvez vos fichiers",
    href: "/documents",
  },
  {
    title: "Paramètres",
    description: "Personnalisez votre espace et préférences",
    href: "/parametres",
  },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        borderRadius: "24px",
        border: "1px solid rgba(138, 116, 255, 0.18)",
        background: "rgba(16, 19, 34, 0.66)",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        minHeight: "100%",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.03) inset, 0 20px 50px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          fontSize: "18px",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        Varna
      </div>

      {menuItems.map((item, index) => {
        const isActive = index === 0;

        return (
          <Link key={item.href} href={item.href}>
            <div
              style={{
                borderRadius: "18px",
                border: "1px solid rgba(138, 116, 255, 0.16)",
                background: isActive
                  ? "linear-gradient(180deg, rgba(143,108,255,0.18), rgba(255,166,92,0.08))"
                  : "rgba(22, 25, 45, 0.72)",
                padding: "14px",
                color: "#f5f2ff",
                boxShadow: isActive
                  ? "0 0 24px rgba(143,108,255,0.10)"
                  : "none",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: "4px",
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  lineHeight: 1.4,
                  color: "#b7b1d9",
                }}
              >
                {item.description}
              </div>
            </div>
          </Link>
        );
      })}

      <div style={{ flex: 1 }} />

      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "999px",
          border: "1px solid rgba(138, 116, 255, 0.16)",
          background: "rgba(22, 25, 45, 0.72)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#c6bddf",
        }}
      >
        ‹
      </div>
    </aside>
  );
}
