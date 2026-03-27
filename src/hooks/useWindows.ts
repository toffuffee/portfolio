import { useState } from "react";
import type { DesktopIcon, WindowState } from "../types/types";

let zCounter = 1;

export function useWindows() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const openWindow = (icon: DesktopIcon) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === icon.id);
      if (existing) {
        return prev.map((w) =>
          w.id === icon.id ? { ...w, minimized: false, zIndex: ++zCounter } : w,
        );
      }
      return [
        ...prev,
        {
          id: icon.id,
          title: icon.label,
          icon: icon.icon,
          x: 120,
          y: 80,
          width: icon.defaultSize.width,
          height: icon.defaultSize.height,
          minimized: false,
          maximized: false,
          zIndex: ++zCounter,
          component: icon.component,
        },
      ];
    });
    setActiveId(icon.id);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveId(null);
  };

  const minimizeWindow = (id: string) =>
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    );

  const restoreWindow = (id: string) =>
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, minimized: false, zIndex: ++zCounter } : w,
      ),
    );

  const maximizeWindow = (id: string) =>
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
    );

  const focusWindow = (id: string) => {
    setActiveId(id);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: ++zCounter } : w)),
    );
  };

  const moveWindow = (id: string, x: number, y: number) =>
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));

  const resizeWindow = (id: string, width: number, height: number) =>
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, width, height } : w)),
    );

  const handleTaskClick = (id: string) => {
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    if (win.minimized) {
      restoreWindow(id);
      focusWindow(id);
    } else if (activeId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return {
    windows,
    activeId,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
    handleTaskClick,
  };
}
