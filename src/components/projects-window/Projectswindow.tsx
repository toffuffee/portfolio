import React, { useState } from "react";

const projects = [
  {
    id: 1,
    name: "CRM System Pro",
    icon: "📊",
    tech: ["React", "Node.js", "PostgreSQL"],
    year: "2024",
    desc: "Корпоративная CRM-система для управления клиентами и сделками. Поддерживает 50,000+ записей, имеет аналитику в реальном времени, интеграцию с email и экспорт в Excel.",
    link: "github.com/ivan/crm-pro",
    size: "142 KB",
    modified: "15.03.2024",
  },
  {
    id: 2,
    name: "ChatBot Platform",
    icon: "🤖",
    tech: ["Python", "FastAPI", "Redis"],
    year: "2023",
    desc: "Платформа для создания и деплоя чат-ботов с поддержкой GPT-4. Webhooks, аналитика диалогов, визуальный конструктор сценариев.",
    link: "github.com/ivan/chatbot-platform",
    size: "89 KB",
    modified: "07.12.2023",
  },
  {
    id: 3,
    name: "DevOps Dashboard",
    icon: "🚀",
    tech: ["Next.js", "Kubernetes", "Grafana"],
    year: "2023",
    desc: "Дашборд для мониторинга k8s-кластеров. Метрики, логи, алерты. Интеграция с Prometheus, Loki и PagerDuty.",
    link: "github.com/ivan/devops-dash",
    size: "67 KB",
    modified: "22.08.2023",
  },
  {
    id: 4,
    name: "E-Commerce Engine",
    icon: "🛒",
    tech: ["TypeScript", "Nest.js", "MySQL"],
    year: "2022",
    desc: "Движок интернет-магазина с корзиной, оплатой через Stripe, управлением инвентарем и генерацией накладных.",
    link: "github.com/ivan/ecom-engine",
    size: "210 KB",
    modified: "01.04.2022",
  },
  {
    id: 5,
    name: "Markdown Blog",
    icon: "📝",
    tech: ["Astro", "Tailwind", "Cloudflare"],
    year: "2022",
    desc: "Статичный блог на Astro с CMS-редактором на основе Markdown. Lighthouse 100/100. CDN-деплой, RSS-фид.",
    link: "github.com/ivan/md-blog",
    size: "34 KB",
    modified: "18.11.2022",
  },
];

export const ProjectsWindow: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [view, setView] = useState<"list" | "detail">("list");

  const selectedProject = projects.find((p) => p.id === selected);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 6px",
          borderBottom: "1px solid #808080",
        }}
      >
        <button
          className="btn98"
          style={{ minWidth: 60, fontSize: 11 }}
          onClick={() => setView("list")}
        >
          📋 Список
        </button>
        <button
          className="btn98"
          style={{ minWidth: 80, fontSize: 11 }}
          disabled={!selected}
          onClick={() => selected && setView("detail")}
        >
          📄 Детали
        </button>
        {view === "detail" && (
          <button
            className="btn98"
            style={{ minWidth: 60, fontSize: 11 }}
            onClick={() => setView("list")}
          >
            ← Назад
          </button>
        )}
      </div>

      {/* Address bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "3px 6px",
          borderBottom: "1px solid #808080",
        }}
      >
        <span style={{ fontSize: 11, color: "#444", whiteSpace: "nowrap" }}>
          Адрес:
        </span>
        <div className="input98" style={{ flex: 1 }}>
          C:\Portfolio\Projects
          {view === "detail" && selectedProject
            ? `\\${selectedProject.name}`
            : "\\"}
        </div>
        <button
          className="btn98"
          style={{ minWidth: 40, padding: "2px 6px", fontSize: 11 }}
        >
          Открыть
        </button>
      </div>

      {view === "list" ? (
        <>
          {/* Column headers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              fontSize: 11,
              padding: "2px 6px",
              background: "#c0c0c0",
            }}
          >
            {["Имя", "Технологии", "Год", "Размер"].map((h) => (
              <div
                key={h}
                style={{
                  boxShadow: "var(--border-raised)",
                  padding: "1px 6px",
                  cursor: "pointer",
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* File list */}
          <div className="listbox" style={{ flex: 1 }}>
            {projects.map((p) => (
              <div
                key={p.id}
                className={`listbox-item ${selected === p.id ? "selected" : ""}`}
                onClick={() => setSelected(p.id)}
                onDoubleClick={() => {
                  setSelected(p.id);
                  setView("detail");
                }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  fontSize: 11,
                  padding: "3px 6px",
                }}
              >
                <span>
                  <span style={{ marginRight: 6, fontSize: 14 }}>{p.icon}</span>
                  {p.name}
                </span>
                <span style={{ fontSize: 10 }}>{p.tech.join(", ")}</span>
                <span>{p.year}</span>
                <span>{p.size}</span>
              </div>
            ))}
          </div>

          {/* Status bar */}
          <div className="statusbar">
            <div className="statusbar-pane">{projects.length} объект(ов)</div>
            <div className="statusbar-pane">
              {selected
                ? `Выбран: ${projects.find((p) => p.id === selected)?.name}`
                : ""}
            </div>
          </div>
        </>
      ) : (
        selectedProject && (
          <div
            style={{
              flex: 1,
              padding: 12,
              overflow: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 48 }}>{selectedProject.icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: "bold" }}>
                  {selectedProject.name}
                </div>
                <div style={{ fontSize: 11, color: "#444" }}>
                  Изменён: {selectedProject.modified}
                </div>
              </div>
            </div>

            <div className="groupbox" style={{ marginTop: 0 }}>
              <span className="groupbox-title">Описание</span>
              <p style={{ fontSize: 11, lineHeight: 1.7, marginTop: 4 }}>
                {selectedProject.desc}
              </p>
            </div>

            <div className="groupbox" style={{ marginTop: 0 }}>
              <span className="groupbox-title">Технологии</span>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  marginTop: 6,
                }}
              >
                {selectedProject.tech.map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: "2px 8px",
                      background: "#000080",
                      color: "#fff",
                      fontSize: 11,
                      boxShadow: "var(--border-raised)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="groupbox" style={{ marginTop: 0 }}>
              <span className="groupbox-title">Ссылки</span>
              <div style={{ marginTop: 6 }}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#0000cc",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  🔗 {selectedProject.link}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button className="btn98">🌐 Открыть</button>
              <button className="btn98">📋 Копировать ссылку</button>
            </div>
          </div>
        )
      )}
    </div>
  );
};
