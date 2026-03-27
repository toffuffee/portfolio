import React, { useRef, useCallback, useEffect } from "react";
import type { WindowState } from "../../types/types";

interface Props {
  win: WindowState;
  children: React.ReactNode;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, w: number, h: number) => void;
  isActive: boolean;
}

export const Window: React.FC<Props> = ({
  win,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMove,
  onResize,
  isActive,
}) => {
  const winRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    startX: number;
    startY: number;
    startWinX: number;
    startWinY: number;
  } | null>(null);

  const containerStyle: React.CSSProperties = {
    position: win.maximized ? "fixed" : "absolute",
    left: win.maximized ? 0 : win.x,
    top: win.maximized ? 0 : win.y,
    width: win.maximized ? "100%" : win.width,
    height: win.maximized ? "calc(100vh - 28px)" : win.height,
    zIndex: win.zIndex,
    display: win.minimized ? "none" : "flex",
    flexDirection: "column",
  };

  const onMouseDownTitle = useCallback(
    (e: React.MouseEvent) => {
      if (win.maximized) return;
      e.preventDefault();
      onFocus(win.id);

      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWinX: win.x,
        startWinY: win.y,
      };

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragState.current) return;
        const dx = ev.clientX - dragState.current.startX;
        const dy = ev.clientY - dragState.current.startY;

        const maxX = window.innerWidth - win.width;
        const maxY = window.innerHeight - win.height;

        onMove(
          win.id,
          Math.max(0, Math.min(dragState.current.startWinX + dx, maxX)),
          Math.max(0, Math.min(dragState.current.startWinY + dy, maxY)),
        );
      };

      const onMouseUp = () => {
        dragState.current = null;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [
      win.id,
      win.x,
      win.y,
      win.width,
      win.height,
      win.maximized,
      onFocus,
      onMove,
    ],
  );

  const onMouseDownResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onFocus(win.id);

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = win.width;
      const startH = win.height;

      const onMouseMove = (ev: MouseEvent) => {
        const newW = Math.max(200, startW + ev.clientX - startX);
        const newH = Math.max(100, startH + ev.clientY - startY);
        onResize(win.id, newW, newH);
      };

      const onMouseUp = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [win.id, win.width, win.height, onFocus, onResize],
  );

  useEffect(() => {
    const el = winRef.current;
    if (el) el.focus();
  }, [isActive]);

  return (
    <div
      ref={winRef}
      className="window"
      style={containerStyle}
      tabIndex={-1}
      onMouseDown={(e) => {
        e.stopPropagation();
        onFocus(win.id);
      }}
    >
      {/* Title bar */}
      <div
        className="window-titlebar"
        style={{
          background: isActive
            ? "linear-gradient(to right, #000080, #1084d0)"
            : "#808080",
        }}
        onMouseDown={onMouseDownTitle}
        onDoubleClick={() => onMaximize(win.id)}
      >
        <div className="window-title">
          <span style={{ fontSize: 16 }}>{win.icon}</span>
          {win.title}
        </div>
        <div className="window-controls">
          <button
            className="window-btn"
            title="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize(win.id);
            }}
          >
            <span style={{ fontSize: 7, lineHeight: 1 }}>▁</span>
          </button>
          <button
            className="window-btn"
            title="Maximize"
            onClick={(e) => {
              e.stopPropagation();
              onMaximize(win.id);
            }}
          >
            <span style={{ fontFamily: "Arial", fontSize: 9, lineHeight: 1 }}>
              {win.maximized ? "❐" : "□"}
            </span>
          </button>
          <button
            className="window-btn"
            title="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose(win.id);
            }}
            style={{ fontWeight: 900, fontSize: 11 }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="window-body"
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        {children}
      </div>

      {/* Resize handle */}
      {!win.maximized && (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 12,
            height: 12,
            cursor: "se-resize",
            zIndex: 10,
          }}
          onMouseDown={onMouseDownResize}
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M12 0 L12 12 L0 12 Z" fill="#808080" opacity={0.5} />
          </svg>
        </div>
      )}
    </div>
  );
};
