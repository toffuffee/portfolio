import React, { useState } from "react";
import type { DesktopIcon } from "../../types/types";

export const StartMenu: React.FC<{
  icons: DesktopIcon[];
  onOpenWindow: (icon: DesktopIcon) => void;
}> = ({ icons, onOpenWindow }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: 0,
        width: 200,
        background: "#c0c0c0",
        border: "2px solid black",
        padding: 5,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {icons.map((icon) => (
        <div
          key={icon.id}
          style={{
            padding: "5px 10px",
            cursor: "pointer",
            background:
              hoveredId === icon.id ? "var(--win-highlight)" : "transparent",
            color: hoveredId === icon.id ? "white" : "inherit",
          }}
          onMouseEnter={() => setHoveredId(icon.id)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => onOpenWindow(icon)}
        >
          {icon.icon} {icon.label}
        </div>
      ))}
    </div>
  );
};
