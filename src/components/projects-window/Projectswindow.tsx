import React, { useState } from 'react';

const projects = [
  {
    id: 1,
    name: 'Infrastructure Mail',
    icon: '✉️',
    tech: [
      'React',
      'TypeScript',
      'MUI',
      'Apache James',
      'JMAP',
      'OpenSearch',
      'Sieve',
    ],
    year: '2026',
    desc: 'Modern mail service built on Apache James and JMAP, featuring fast full-text search with OpenSearch, flexible email filtering via Sieve, and a clean, responsive UI powered by React and MUI.',
    size: '342 KB',
  },
  {
    id: 2,
    name: 'Infrastructure Admin panel',
    icon: '🔒',
    tech: ['React', 'TypeScript', 'MUI'],
    year: '2025',
    desc: 'Administrative panel for managing infrastructure services, built with React and TypeScript. Provides a clean, responsive interface using MUI for monitoring, configuration, and control of system components.',
    size: '271 KB',
  },
  {
    id: 3,
    name: 'Infrastructure Settings service',
    icon: '⚙️',
    tech: ['React', 'TypeScript', 'MUI'],
    year: '2025',
    desc: 'Centralized settings service for managing account preferences and infrastructure-wide theming. Built with React and TypeScript, it provides a unified interface for configuring user settings and customizing the look and feel across the entire platform.',
    size: '243 KB',
  },
  {
    id: 4,
    name: 'Portal Tronic',
    icon: '🖥️',
    tech: ['React', 'TypeScript', 'MUI'],
    year: '2024',
    desc: 'Portal for purchasing, configuring, and deploying infrastructure services. Built with React and TypeScript, it provides a streamlined interface for managing the full lifecycle—from setup to launch—within a single platform.',
    size: '214 KB',
  },
  {
    id: 5,
    name: 'Mail text editor',
    icon: '📝',
    tech: ['React', 'TypeScript', 'execCommand API', 'Shadow DOM'],
    year: '2023',
    desc: 'Lightweight rich text editor for composing emails, built with React and TypeScript. Uses the execCommand API and Shadow DOM to provide isolated styling and a smooth writing experience.',
    size: '12 KB',
  },
  {
    id: 6,
    name: 'CDEK Odoo module',
    icon: '🛒',
    tech: ['Python', 'Odoo', 'MySQL', 'CDEK API'],
    year: '2022',
    desc: 'Odoo module integrating CDEK delivery services, built with Python. Enables automated shipping calculations, order tracking, and seamless interaction with the CDEK API within the Odoo ecosystem.',
    size: '185 KB',
  },
  {
    id: 7,
    name: 'Caravans website',
    icon: '🛤️',
    tech: ['Owl', 'JavaScript', 'Python', 'Odoo', 'MySQL'],
    year: '2021',
    desc: 'Community-driven website for caravan enthusiasts, featuring trip planning, excursions, thematic forums, and a shared knowledge base. Built with Odoo and Owl, it provides a platform for travelers to connect, share experiences, and organize journeys.',
    size: '244 KB',
  },
];

export const ProjectsWindow: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [view, setView] = useState<'list' | 'detail'>('list');

  const selectedProject = projects.find((p) => p.id === selected);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 6px',
          borderBottom: '1px solid #808080',
        }}
      >
        <button
          className="btn98"
          style={{ minWidth: 80, fontSize: 11 }}
          disabled={!selected}
          onClick={() => selected && setView('detail')}
        >
          📄 Details
        </button>
        {view === 'detail' && (
          <button
            className="btn98"
            style={{ minWidth: 60, fontSize: 11 }}
            onClick={() => setView('list')}
          >
            ← Back
          </button>
        )}
      </div>

      {/* Address bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '3px 6px',
          borderBottom: '1px solid #808080',
        }}
      >
        <span style={{ fontSize: 11, color: '#444', whiteSpace: 'nowrap' }}>
          Path:
        </span>
        <div className="input98" style={{ flex: 1 }}>
          C:\Portfolio\Projects
          {view === 'detail' && selectedProject
            ? `\\${selectedProject.name}`
            : '\\'}
        </div>
      </div>

      {view === 'list' ? (
        <>
          {/* Column headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr 1fr',
              fontSize: 11,
              padding: '2px 6px',
              background: '#c0c0c0',
            }}
          >
            {['Name', 'Technologies', 'Year', 'Size'].map((h) => (
              <div
                key={h}
                style={{
                  boxShadow: 'var(--border-raised)',
                  padding: '1px 6px',
                  cursor: 'pointer',
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
                className={`listbox-item ${selected === p.id ? 'selected' : ''}`}
                onClick={() => setSelected(p.id)}
                onDoubleClick={() => {
                  setSelected(p.id);
                  setView('detail');
                }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1fr 1fr',
                  fontSize: 11,
                  padding: '3px 6px',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      display: 'block',
                      width: '19px',
                      height: '19px',
                    }}
                  >
                    {p.icon}
                  </span>
                  {p.name}
                </span>
                <span style={{ fontSize: 10 }}>{p.tech.join(', ')}</span>
                <span>{p.year}</span>
                <span>{p.size}</span>
              </div>
            ))}
          </div>

          {/* Status bar */}
          <div className="statusbar">
            <div className="statusbar-pane">{projects.length} object(-s)</div>
            <div className="statusbar-pane">
              {selected
                ? `Selected: ${projects.find((p) => p.id === selected)?.name}`
                : ''}
            </div>
          </div>
        </>
      ) : (
        selectedProject && (
          <div
            style={{
              flex: 1,
              padding: 12,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 48 }}>{selectedProject.icon}</span>
              <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                {selectedProject.name}
              </div>
            </div>

            <div className="groupbox" style={{ marginTop: 10 }}>
              <span className="groupbox-title">Description</span>
              <p style={{ fontSize: 11, lineHeight: 1.7, marginTop: 4 }}>
                {selectedProject.desc}
              </p>
            </div>

            <div className="groupbox" style={{ marginTop: 10 }}>
              <span className="groupbox-title">Technologies</span>
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  flexWrap: 'wrap',
                  marginTop: 6,
                }}
              >
                {selectedProject.tech.map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: '2px 8px',
                      background: '#000080',
                      color: '#fff',
                      fontSize: 11,
                      boxShadow: 'var(--border-raised)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};
