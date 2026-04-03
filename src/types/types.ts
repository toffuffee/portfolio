export interface WindowState {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  component: string;
}

export type Point = { x: number; y: number };

export interface Track {
  title: string;
  src: string;
}

export type DesktopIcon = {
  id: string;
  label: string;
  icon: string;
  component: string;
  defaultSize: { width: number; height: number };
  x: number;
  y: number;
};
