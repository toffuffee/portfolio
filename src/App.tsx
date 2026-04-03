import React, { useState, useCallback } from 'react';
import type { DesktopIcon, Track } from './types/types';
import { ProjectsWindow } from './components/projects-window/ProjectsWindow';
import { AboutWindow } from './components/about-window/AboutWindow';
import { Window } from './components/window/Window';
import { Taskbar } from './components/taskbar/Taskbar';
import { StartMenu } from './components/start-menu/StartMenu';

import { useWindows } from './hooks/useWindows';
import { useDesktopIcons } from './hooks/useDesktopIcons';
import { MinesweeperWindow } from './components/minesweeper-window/MinesweeperWindow';
import { BootScreen } from './components/boot-screen/BootScreen';
import { DosGameWindow } from './components/dos-game-window/DosGameWindow';
import { VideoPlayerWindow } from './components/video-player-window/VideoPlayerWindow';
import { renderIcon } from './utils/renderIcon';

const TRACKS: Track[] = [
  { title: 'Joji - Glimpse of Us', src: '/videos/video1.mp4' },
  { title: 'Joji - Last of a Dying Breed Dior', src: '/videos/video2.mp4' },
  // Add more videos here, e.g.:
];

const COMPONENTS: Record<string, React.FC> = {
  projects: ProjectsWindow,
  about: AboutWindow,
  minesweeper: MinesweeperWindow,
  doom: () => <DosGameWindow bundleUrl="/games/doom/doom.jsdos" />,
  keen: () => <DosGameWindow bundleUrl="/games/keen/keen.jsdos" />,
  earthworm: () => (
    <DosGameWindow bundleUrl="/games/earthworm/earthworm.jsdos" />
  ),
  ultima: () => <DosGameWindow bundleUrl="/games/ultima/ultima.jsdos" />,
  video: () => <VideoPlayerWindow tracks={TRACKS} />,
};

const initialIcons: DesktopIcon[] = [
  {
    id: 'about',
    label: 'About Me',
    icon: '👤',
    component: 'about',
    defaultSize: { width: 500, height: 400 },
    x: 20,
    y: 20,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: '📁',
    component: 'projects',
    defaultSize: { width: 600, height: 400 },
    x: 40,
    y: 20,
  },
  {
    id: 'video',
    label: 'Media Player',
    icon: '🎬',
    component: 'video',
    defaultSize: { width: 600, height: 400 },
    x: 20,
    y: 40,
  },
  {
    id: 'minesweeper',
    label: 'Sapper',
    icon: '💣',
    component: 'minesweeper',
    defaultSize: { width: 350, height: 400 },
    x: 20,
    y: 220,
  },
  {
    id: 'doom',
    label: 'DOOM',
    icon: '/icons/Doom.png',
    component: 'doom',
    defaultSize: { width: 800, height: 560 },
    x: 40,
    y: 220,
  },
  {
    id: 'ultima',
    label: 'Ultima Underworld',
    icon: '⚔️',
    component: 'ultima',
    defaultSize: { width: 800, height: 560 },
    x: 20,
    y: 420,
  },

  // Четвёртый ряд
  {
    id: 'keen',
    label: 'Commander Keen',
    icon: '/icons/Keen4.ico',
    component: 'keen',
    defaultSize: { width: 800, height: 560 },
    x: 20,
    y: 320,
  },
  {
    id: 'earthworm',
    label: 'Earthworm Jim',
    icon: '/icons/Earthworm.png',
    component: 'earthworm',
    defaultSize: { width: 800, height: 560 },
    x: 40,
    y: 320,
  },
];

export default function App() {
  const [booted, setBooted] = useState(false);
  const [startOpen, setStartOpen] = useState(false);

  const handleBootDone = useCallback(() => setBooted(true), []);

  const {
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
  } = useWindows();

  const {
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
  } = useDesktopIcons(initialIcons);

  return (
    <>
      <BootScreen onDone={handleBootDone} />

      <div
        className="desktop"
        style={{
          width: '100vw',
          height: '100vh',
          position: 'relative',
          opacity: booted ? 1 : 0,
          transition: 'opacity 0.4s ease 0.1s',
        }}
        onMouseMove={(e) => {
          onMouseMove(e);
          onMouseMoveDesktop(e);
        }}
        onMouseUp={() => {
          onMouseUp();
          onMouseUpDesktop();
        }}
        onMouseDown={onMouseDownDesktop}
      >
        {icons.map((icon) => (
          <div
            key={icon.id}
            className="desktop-icon"
            style={{
              position: 'absolute',
              left: icon.x,
              top: icon.y,
              cursor: 'pointer',
              border: selectedIcons.has(icon.id)
                ? '1px solid #0078d7'
                : '1px solid #00000000',
              background: selectedIcons.has(icon.id)
                ? 'rgba(0,120,215,0.2)'
                : 'transparent',
              zIndex: draggingIcon && selectedIcons.has(icon.id) ? 9999 : 1,
            }}
            onMouseDown={(e) => onMouseDownIcon(icon.id, e)}
            onDoubleClick={() => {
              openWindow(icon);
              setSelectedIcons((prev) => {
                const newSet = new Set(prev);
                newSet.delete(icon.id);
                return newSet;
              });
            }}
          >
            <div className="icon-img" style={{ pointerEvents: 'none' }}>
              {renderIcon(icon.icon, 32)}
            </div>

            <div className="icon-label">{icon.label}</div>
          </div>
        ))}

        {selection && (
          <div
            style={{
              position: 'absolute',
              left: Math.min(selection.x, selection.x + selection.w),
              top: Math.min(selection.y, selection.y + selection.h),
              width: Math.abs(selection.w),
              height: Math.abs(selection.h),
              background: 'rgba(0,120,215,0.2)',
              border: '1px dashed #0078d7',
              pointerEvents: 'none',
            }}
          />
        )}

        {windows.map((w) => {
          const Comp = COMPONENTS[w.component];
          return (
            <Window
              key={w.id}
              win={w}
              isActive={activeId === w.id}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onMaximize={maximizeWindow}
              onFocus={focusWindow}
              onMove={moveWindow}
              onResize={resizeWindow}
            >
              <Comp />
            </Window>
          );
        })}

        <Taskbar
          windows={windows}
          activeId={activeId}
          onTaskClick={handleTaskClick}
          onStartClick={() => setStartOpen((s) => !s)}
        />

        {startOpen && (
          <StartMenu
            icons={icons}
            onOpenWindow={(icon) => {
              openWindow(icon);
              setStartOpen(false);
            }}
          />
        )}
      </div>
    </>
  );
}
