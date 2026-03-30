import { useEffect, useState, useRef } from 'react';

const BOOT_LINES = [
  { text: 'PAULDOS v2.31 (C) 1994 Paul Systems Inc.', delay: 0 },
  { text: 'All rights reserved.', delay: 80 },
  { text: '', delay: 160 },
  { text: 'CPU: Intel 486DX2/66MHz', delay: 300 },
  { text: 'MEMORY TEST: 640K Base ... OK', delay: 480 },
  { text: 'EXTENDED MEMORY: 8192K ... OK', delay: 660 },
  { text: '', delay: 800 },
  { text: 'Loading HIMEM.SYS...', delay: 950 },
  { text: 'Loading EMM386.EXE...', delay: 1150 },
  { text: '', delay: 1280 },
  { text: 'PAULDOS is loading, please wait...', delay: 1400 },
  { text: '', delay: 1550 },
  { text: 'Initializing device drivers...', delay: 1700 },
  { text: '  [MOUSE]    PS/2 Mouse driver v8.10 loaded.', delay: 1900 },
  { text: '  [SOUND]    SoundBlaster 16 detected on IRQ5.', delay: 2100 },
  {
    text: '  [VIDEO]    VGA adapter initialized (640x480, 256 colors).',
    delay: 2300,
  },
  { text: '  [NETWORK]  Packet driver loaded. No carrier.', delay: 2500 },
  { text: '', delay: 2700 },
  { text: 'Starting PAUL Desktop Environment...', delay: 2900 },
];

const PROGRESS_START = 3200;
const PROGRESS_DURATION = 2200;
const TOTAL_DURATION = PROGRESS_START + PROGRESS_DURATION + 600;

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [showProgress, setShowProgress] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showError, setShowError] = useState(false);
  const [done, setDone] = useState(false);
  const progressStartTime = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const isMobileDevice = () => {
    if (typeof navigator === 'undefined') return false;

    const ua = navigator.userAgent.toLowerCase();

    return (
      /android|iphone|ipad|ipod|mobile|tablet/.test(ua) ||
      window.innerWidth < 768
    );
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), line.delay));
    });

    timers.push(
      setTimeout(() => {
        progressStartTime.current = Date.now();
        setShowProgress(true);
      }, PROGRESS_START)
    );

    timers.push(
      setTimeout(() => {
        if (isMobileDevice()) {
          setShowError(true);
          return;
        }

        setFadeOut(true);
        setTimeout(() => {
          setDone(true);
          onDone();
        }, 600);
      }, TOTAL_DURATION)
    );

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  useEffect(() => {
    if (!showProgress) return;
    const animate = () => {
      const elapsed = Date.now() - progressStartTime.current;
      const pct = Math.min(elapsed / PROGRESS_DURATION, 1);
      setProgress(pct);
      if (pct < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [showProgress]);

  if (done) return null;

  const BAR_WIDTH = 40;
  const filled = Math.round(progress * BAR_WIDTH);
  const bar = '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled);
  const pct = Math.round(progress * 100);

  if (showError) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000',
          color: '#ff5555',
          fontFamily: '"Courier New", monospace',
          padding: '32px 48px',
          zIndex: 99999,
        }}
      >
        <div style={{ color: '#fff', marginBottom: '16px' }}>PAULDOS v2.31</div>

        <div>ERROR: SYSTEM HALTED</div>

        <div>INCOMPATIBLE HARDWARE DETECTED</div>

        <div style={{ marginTop: '12px' }}>
          Reason: Unsupported device architecture.
        </div>

        <div style={{ marginTop: '12px' }}>
          Required: IBM PC compatible computer.
        </div>

        <div style={{ marginTop: '24px', color: '#aaa' }}>
          Press CTRL+ALT+DEL to restart
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: '32px 48px',
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: '14px',
        color: '#c0c0c0',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.6s ease',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '120px',
          left: '450px',
          fontSize: '120px',
          color: '#00ff00',
          fontFamily: '"Courier New", monospace',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        &gt;_
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            style={{
              lineHeight: '1.6',
              color: i === 0 ? '#ffffff' : i === 1 ? '#a0a0a0' : '#c0c0c0',
              fontWeight: i === 0 ? 'bold' : 'normal',
              letterSpacing: '0.03em',
              whiteSpace: 'pre',
            }}
          >
            {line.text || '\u00a0'}
          </div>
        ))}
        {showProgress && (
          <div style={{ marginTop: '12px' }}>
            <div
              style={{
                color: '#ffffff',
                marginBottom: '6px',
                letterSpacing: '0.05em',
              }}
            >
              Loading desktop... {pct}%
            </div>
            <div
              style={{
                color: '#00cc00',
                letterSpacing: '0.01em',
                fontFamily: '"Courier New", monospace',
                textShadow: '0 0 8px rgba(0,204,0,0.6)',
              }}
            >
              [{bar}]
            </div>
            {progress >= 1 && (
              <div style={{ marginTop: '10px', color: '#ffffff' }}>Done.</div>
            )}
          </div>
        )}
        {!showProgress && visibleLines > 0 && <BlinkingCursor />}
      </div>
    </div>
  );
}

function BlinkingCursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      style={{
        display: 'inline-block',
        width: '9px',
        height: '15px',
        background: on ? '#c0c0c0' : 'transparent',
        verticalAlign: 'middle',
        marginLeft: '2px',
      }}
    />
  );
}
