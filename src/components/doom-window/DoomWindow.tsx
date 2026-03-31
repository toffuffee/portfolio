import React, { useEffect, useRef } from 'react';

interface DosInstance {
  run: (bundleUrl: string) => Promise<void>;
  stop: () => Promise<void>;
}

declare global {
  interface Window {
    Dos?: (
      container: HTMLDivElement,
      opts?: Record<string, unknown>
    ) => DosInstance;
  }
}

const JS_DOS_URL = '/js-dos.js';
const DOOM_BUNDLE_URL = '/doom/doom.jsdos';

const loadStyle = (href: string): Promise<void> =>
  new Promise((resolve) => {
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve();
      return;
    }
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.onload = () => resolve();
    document.head.appendChild(l);
  });

const loadScript = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (window.Dos) {
        resolve();
      } else {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () =>
          reject(new Error(`Failed to load ${src}`))
        );
      }
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });

export const DoomWindow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dosRef = useRef<DosInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    const load = async () => {
      await loadStyle('/js-dos.css');
      await loadScript(JS_DOS_URL);
      if (cancelled || !containerRef.current || !window.Dos) return;

      dosRef.current = window.Dos(containerRef.current, {
        wdosboxUrl: '/wdosbox.js',
      });
      await dosRef.current.run(DOOM_BUNDLE_URL);
    };

    load();

    return () => {
      cancelled = true;
      dosRef.current?.stop?.();
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
