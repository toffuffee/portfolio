import React, { useState, useEffect } from "react";
import type { WindowState } from "../../types/types";

interface Props {
  windows: WindowState[];
  activeId: string | null;
  onTaskClick: (id: string) => void;
  onStartClick: () => void;
}

export const Taskbar: React.FC<Props> = ({
  windows,
  activeId,
  onTaskClick,
  onStartClick,
}) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      );
    };
    update();
    const t = setInterval(update, 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="taskbar">
      <button className="start-btn" onClick={onStartClick}>
        <b>Пуск</b>
      </button>
      <div className="taskbar-divider" />

      {windows.map((w) => (
        <button
          key={w.id}
          className={`taskbar-task ${activeId === w.id && !w.minimized ? "active" : ""}`}
          onClick={() => onTaskClick(w.id)}
          title={w.title}
        >
          <span style={{ fontSize: 13 }}>{w.icon}</span>
          {w.title}
        </button>
      ))}

      <div className="taskbar-clock">
        <span>🔊</span>&nbsp;&nbsp;{time}
      </div>
    </div>
  );
};
