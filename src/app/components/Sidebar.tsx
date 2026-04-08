import Link from "next/link";

const menuItems = [
  {
    title: "Inbox",
    description: "Tous vos messages\net tâches centralisées",
    href: "/inbox",
    active: true,
    icon: "✉",
  },
  {
    title: "Aujourd'hui",
    description: "Votre journée, vos\npriorités, vos actions",
    href: "/aujourdhui",
    icon: "24",
  },
  {
    title: "Calendrier",
    description: "Planifiez et gérez\nvos rendez-vous",
    href: "/calendrier",
    icon: "24",
  },
  {
    title: "Factures",
    description: "Suivi, création et\npaiement de factures",
    href: "/factures",
    icon: "▤",
  },
  {
    title: "Documents",
    description: "Stockez, organisez\net retrouvez vos fichiers",
    href: "/documents",
    icon: "▣",
    plus: true,
  },
  {
    title: "Paramètres",
    description: "Personnalisez votre\nespace et vos préférences",
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
        border: "1px solid rgba(94, 91, 180, 0.24)",
        background:
          "linear-gradient(180deg, rgba(10,12,33,0.92), rgba(8,10,26,0.90))",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.02) inset, 0 20px 70px rgba(0,0,0,0.30), 0 0 50px rgba(82,66,188,0.08)",
        overflow: "hidden",
        minHeight: "100%",
        padding: "14px 14px 68px 14px",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(circle at 14% 20%, rgba(110, 96, 255, 0.10), transparent 18%),
            radial-gradient(circle at 0% 72%, rgba(255, 150, 79, 0.08), transparent 18%),
            radial-gradient(circle at 18% 86%, rgba(130, 104, 255, 0.08), transparent 16%)
          `,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "4px 8px 12px 8px",
          marginBottom: "4px",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderBottom: "20px solid #78a6ff",
            transform: "rotate(180deg)",
            filter: "drop-shadow(0 0 10px rgba(120,166,255,0.42))",
          }}
        />
        <div
          style={{
            color: "#f0ebff",
            fontSize: "22px",
            fontWeight: 500,
            letterSpacing: "-0.03em",
          }}
        >
          Varna
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div
              style={{
                position: "relative",
                borderRadius: "18px",
                border: item.active
                  ? "1px solid rgba(197, 166, 255, 0.28)"
                  : "1px solid rgba(90, 88, 170, 0.16)",
                background: item.active
                  ? "linear-gradient(180deg, rgba(90,67,167,0.60), rgba(48,38,95,0.90))"
                  : "linear-gradient(180deg, rgba(17,20,44,0.88), rgba(11,14,31,0.88))",
                boxShadow: item.active
                  ? "0 0 24px rgba(202,160,255,0.16), 0 0 0 1px rgba(255,255,255,0.02) inset"
                  : "0 0 0 1px rgba(255,255,255,0.015) inset",
                padding: "14px 14px",
                display: "grid",
                gridTemplateColumns: "34px 1fr auto",
                gap: "12px",
                alignItems: "start",
              }}
            >
              {item.active && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "18px",
                    pointerEvents: "none",
                    background:
                      "radial-gradient(circle at 100% 50%, rgba(210,150,255,0.10), transparent 42%)",
                  }}
                />
              )}

              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  border: item.active
                    ? "1px solid rgba(210, 192, 255, 0.18)"
                    : "1px solid rgba(159, 149, 230, 0.12)",
                  background: item.active
                    ? "linear-gradient(180deg, rgba(87,80,156,0.90), rgba(50,43,106,0.90))"
                    : "linear-gradient(180deg, rgba(58,54,112,0.72), rgba(30,27,72,0.72))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#f2edff",
                  fontSize: item.icon === "24" ? "13px" : "17px",
                  fontWeight: 700,
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {item.icon}
              </div>

              <div style={{ position: "relative", zIndex: 1 }}>
                <div
                  style={{
                    color: "#f4f0ff",
                    fontSize: "14px",
                    fontWeight: 700,
                    marginBottom: "4px",
                    lineHeight: 1.2,
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    color: "#b8b1d8",
                    fontSize: "11.5px",
                    lineHeight: 1.36,
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.description}
                </div>
              </div>

              {item.plus ? (
                <div
                  style={{
                    color: "#c8c1ee",
                    fontSize: "18px",
                    paddingTop: "2px",
                    position: "relative",
                    zIndex: 1,
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
          left: "16px",
          bottom: "14px",
          width: "34px",
          height: "34px",
          borderRadius: "999px",
          border: "1px solid rgba(94, 91, 180, 0.22)",
          background:
            "linear-gradient(180deg, rgba(24,27,56,0.95), rgba(10,12,28,0.92))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ddd6ff",
          fontSize: "18px",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset",
        }}
      >
        ‹
      </div>
    </aside>
  );
}
