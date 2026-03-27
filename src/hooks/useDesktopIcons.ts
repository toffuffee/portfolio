import { useState } from "react";
import type { DesktopIcon, Point } from "../types/types";

const GRID_SIZE = 80;
const ICON_SIZE = 60;
const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

export function useDesktopIcons(initialIcons: DesktopIcon[]) {
  const [icons, setIcons] = useState(
    initialIcons.map((icon, i) => ({
      ...icon,
      x: snapToGrid(20),
      y: snapToGrid(20 + i * GRID_SIZE),
    })),
  );
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null);
  const [dragStartPositions, setDragStartPositions] = useState<
    Record<string, Point>
  >({});
  const [dragStartMouse, setDragStartMouse] = useState<Point | null>(null);
  const [selection, setSelection] = useState<null | {
    x: number;
    y: number;
    w: number;
    h: number;
  }>(null);
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());

  const onMouseDownIcon = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (e.detail > 1) return;

    setDraggingIcon(id);

    const newSelected = selectedIcons.has(id) ? selectedIcons : new Set([id]);
    if (!selectedIcons.has(id)) setSelectedIcons(newSelected);

    const startPositions: Record<string, { x: number; y: number }> = {};
    icons.forEach((icon) => {
      if (newSelected.has(icon.id)) {
        startPositions[icon.id] = { x: icon.x, y: icon.y };
      }
    });
    setDragStartPositions(startPositions);
    setDragStartMouse({ x: e.clientX, y: e.clientY });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!draggingIcon || !dragStartMouse) return;
    const dx = e.clientX - dragStartMouse.x;
    const dy = e.clientY - dragStartMouse.y;
    const desktopHeight = window.innerHeight - 40;

    setIcons((prev) =>
      prev.map((icon) => {
        if (!selectedIcons.has(icon.id)) return icon;
        const start = dragStartPositions[icon.id];
        if (!start) return icon;
        return {
          ...icon,
          x: Math.max(0, Math.min(start.x + dx, window.innerWidth - ICON_SIZE)),
          y: Math.max(0, Math.min(start.y + dy, desktopHeight - ICON_SIZE)),
        };
      }),
    );
  };

  const onMouseUp = () => {
    if (draggingIcon) {
      setIcons((prev) => {
        const occupiedPositions = new Set<string>();
        const result: DesktopIcon[] = [];
        const desktopHeight = window.innerHeight - 40;

        for (const icon of prev) {
          if (!selectedIcons.has(icon.id)) {
            occupiedPositions.add(`${icon.x},${icon.y}`);
            result.push(icon);
          }
        }

        for (const icon of prev) {
          if (selectedIcons.has(icon.id)) {
            let x = snapToGrid(
              Math.min(Math.max(icon.x, 0), window.innerWidth - ICON_SIZE),
            );
            let y = snapToGrid(
              Math.min(Math.max(icon.y, 0), desktopHeight - ICON_SIZE),
            );

            while (occupiedPositions.has(`${x},${y}`)) {
              y += GRID_SIZE;
              if (y + ICON_SIZE > desktopHeight) {
                y = 0;
                x += GRID_SIZE;
              }
            }

            occupiedPositions.add(`${x},${y}`);
            result.push({ ...icon, x, y });
          }
        }

        return result;
      });
    }
    setDraggingIcon(null);
    setDragStartPositions({});
    setDragStartMouse(null);
  };

  const onMouseDownDesktop = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).classList.contains("desktop-icon")) {
      setSelectedIcons(new Set());
      setSelection({ x: e.clientX, y: e.clientY, w: 0, h: 0 });
    }
  };

  const onMouseMoveDesktop = (e: React.MouseEvent) => {
    if (!selection) return;
    setSelection({
      ...selection,
      w: e.clientX - selection.x,
      h: e.clientY - selection.y,
    });

    const selX = Math.min(selection.x, selection.x + selection.w);
    const selY = Math.min(selection.y, selection.y + selection.h);
    const selW = Math.abs(selection.w);
    const selH = Math.abs(selection.h);

    setSelectedIcons(
      new Set(
        icons
          .filter(
            (icon) =>
              !(
                icon.x + ICON_SIZE < selX ||
                icon.x > selX + selW ||
                icon.y + ICON_SIZE < selY ||
                icon.y > selY + selH
              ),
          )
          .map((i) => i.id),
      ),
    );
  };

  const onMouseUpDesktop = () => setSelection(null);

  return {
    icons,
    draggingIcon,
    selectedIcons,
    selection,
    onMouseDownIcon,
    onMouseMove,
    onMouseUp,
    onMouseDownDesktop,
    onMouseMoveDesktop,
    onMouseUpDesktop,
    setSelectedIcons,
  };
}
