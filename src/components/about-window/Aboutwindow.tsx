import React, { useState } from "react";

const tabs = ["Личное", "Навыки", "Образование"];

export const AboutWindow: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: 8,
        gap: 4,
      }}
    >
      {/* Properties header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 0 12px",
        }}
      >
        <span style={{ fontSize: 48 }}>👤</span>
        <div>
          <div style={{ fontSize: 16, fontWeight: "bold" }}>
            Иван Разработчиков
          </div>
          <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>
            Full-Stack Developer
          </div>
          <div style={{ fontSize: 11, color: "#444" }}>v1.0.0 © 1998–2026</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-strip">
        {tabs.map((t, i) => (
          <div
            key={t}
            className={`tab ${activeTab === i ? "active" : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {t}
          </div>
        ))}
      </div>

      <div className="tab-content" style={{ flex: 1 }}>
        {activeTab === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="groupbox">
              <span className="groupbox-title">Контакты</span>
              <table
                style={{
                  width: "100%",
                  fontSize: 11,
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  {[
                    ["📧 Email", "ivan@example.com"],
                    ["🐙 GitHub", "github.com/ivan"],
                    ["💼 LinkedIn", "linkedin.com/in/ivan"],
                    ["🌍 Город", "Москва, Россия"],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td
                        style={{
                          padding: "3px 8px 3px 0",
                          whiteSpace: "nowrap",
                          color: "#444",
                        }}
                      >
                        {k}
                      </td>
                      <td
                        style={{
                          padding: "3px 0",
                          color: "#0000cc",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {v}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="groupbox">
              <span className="groupbox-title">О себе</span>
              <p style={{ fontSize: 11, lineHeight: 1.6, marginTop: 4 }}>
                Привет! Я Full-Stack разработчик с 5+ летним опытом создания
                веб-приложений. Люблю чистый код, нестандартные UI-решения и
                ностальгию по Windows 98. В свободное время пишу на Rust и играю
                в Quake III.
              </p>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "TypeScript / JavaScript", value: 95 },
              { label: "React / Next.js", value: 90 },
              { label: "Node.js / Express", value: 85 },
              { label: "Python / FastAPI", value: 75 },
              { label: "PostgreSQL / Redis", value: 80 },
              { label: "Docker / Kubernetes", value: 70 },
              { label: "Rust", value: 45 },
            ].map((skill) => (
              <div
                key={skill.label}
                style={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                  }}
                >
                  <span>{skill.label}</span>
                  <span style={{ color: "#444" }}>{skill.value}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${skill.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              {
                year: "2015–2019",
                title: "Бакалавр, МГТУ им. Баумана",
                sub: "Информатика и вычислительная техника",
                icon: "🎓",
              },
              {
                year: "2019–2021",
                title: "Магистр, ВШЭ",
                sub: "Программная инженерия",
                icon: "🎓",
              },
              {
                year: "2021",
                title: "AWS Certified Developer",
                sub: "Amazon Web Services",
                icon: "📜",
              },
              {
                year: "2023",
                title: "CKA — Certified Kubernetes Administrator",
                sub: "Cloud Native Computing Foundation",
                icon: "📜",
              },
            ].map((item) => (
              <div
                key={item.year}
                className="groupbox"
                style={{ marginTop: 0 }}
              >
                <span className="groupbox-title">{item.year}</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: 11 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 11, color: "#444" }}>
                      {item.sub}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
