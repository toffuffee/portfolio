import React, { useState } from 'react';

const tabs = ['Info', 'Skills', 'Study'];

export const AboutWindow: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 8,
        gap: 4,
      }}
    >
      {/* Properties header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '8px 0 12px',
        }}
      >
        <span style={{ fontSize: 48 }}>👤</span>
        <div>
          <div style={{ fontSize: 16, fontWeight: 'bold' }}>Pavel Orlov</div>
          <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>
            Frontend Developer
          </div>
          <div style={{ fontSize: 11, color: '#444' }}>v5.3.8 © 2022–2026</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-strip">
        {tabs.map((t, i) => (
          <div
            key={t}
            className={`tab ${activeTab === i ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {t}
          </div>
        ))}
      </div>

      <div className="tab-content" style={{ flex: 1 }}>
        {activeTab === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="groupbox">
              <span className="groupbox-title">Contacts</span>
              <table
                style={{
                  width: '100%',
                  fontSize: 11,
                  borderCollapse: 'collapse',
                }}
              >
                <tbody>
                  {[
                    ['📧 Email', 'jim.jimer.2003@gmail.com'],
                    ['🐙 GitHub', 'github.com/toffuffee'],
                    ['🌍 City', 'Kursk, Russia'],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td
                        style={{
                          padding: '3px 8px 3px 0',
                          whiteSpace: 'nowrap',
                          color: '#444',
                        }}
                      >
                        {k}
                      </td>
                      <td
                        style={{
                          padding: '3px 0',
                          color: '#0000cc',
                          textDecoration: 'underline',
                          cursor: 'pointer',
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
              <span className="groupbox-title">About</span>
              <p style={{ fontSize: 11, lineHeight: 1.6, marginTop: 4 }}>
                Hi! I'm a frontend developer with 5+ years of experience
                creating web applications. I love clean code, unique UI
                solutions, and a fondness for Windows 98. In my free time, I
                play Heroes of Might and Magic III.
              </p>
            </div>

            <div className="groupbox">
              <span className="groupbox-title">Work</span>
              {[
                {
                  year: '2021–2023',
                  title: 'ERP Smart',
                  sub: 'Odoo developer',
                  icon: '🖥️',
                },
                {
                  year: '2023–2024',
                  title:
                    'Ivannikov Institute for System Programming of the Russian Academy of Sciences',
                  sub: 'Frontend developer',
                  icon: '🖥️',
                },
                {
                  year: '2024-now',
                  title: 'Tronic Asia Group',
                  sub: 'Frontend developer',
                  icon: '🖥️',
                },
              ].map((item) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    marginTop: 10,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: 11 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#444' }}>
                      {item.sub}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: '#444',
                        fontStyle: 'italic',
                      }}
                    >
                      {item.year}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'TypeScript / JavaScript', value: 95 },
              { label: 'React', value: 86 },
              { label: 'Vue', value: 63 },
              { label: 'Svelte', value: 57 },
              { label: 'Python / FastAPI / Django / Flask', value: 55 },
              { label: 'PostgreSQL', value: 47 },
              { label: 'C#', value: 36 },
              { label: 'Asterisk', value: 26 },
              { label: 'LISP', value: 15 },
            ].map((skill) => (
              <div
                key={skill.label}
                style={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 11,
                  }}
                >
                  <span>{skill.label}</span>
                  <span style={{ color: '#444' }}>{skill.value}%</span>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              {
                year: '2019',
                title: 'WorldSkills',
                sub: 'Participant',
                icon: '📜',
              },
              {
                year: '2021–2025',
                title: "Bachelor's degree, Southwestern State University.",
                sub: 'Software Engineering',
                icon: '🎓',
              },
              {
                year: '2025–2027',
                title: "Master's degree, South-West State University",
                sub: 'Software Engineering',
                icon: '🎓',
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
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: 11 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 11, color: '#444' }}>
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
