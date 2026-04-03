import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { Track } from '../../types/types';

interface VideoPlayerWindowProps {
  tracks?: Track[];
}

function formatTime(secs: number): string {
  if (!isFinite(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const VideoPlayerWindow: React.FC<VideoPlayerWindowProps> = ({
  tracks = [],
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [loop, setLoop] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Ready');
  const [draggingProgress, setDraggingProgress] = useState(false);

  const track = tracks[trackIndex] || { title: 'No video', src: '' };

  const status = (msg: string) => setStatusMsg(msg);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrentTime(v.currentTime);
    const onDuration = () => setDuration(v.duration);
    const onEnded = () => {
      setPlaying(false);
      status('Stopped');
      if (loop) {
        v.currentTime = 0;
        v.play();
        setPlaying(true);
      }
    };
    const onPlay = () => {
      setPlaying(true);
      status('Playing');
    };
    const onPause = () => {
      setPlaying(false);
      status('Paused');
    };
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onDuration);
    v.addEventListener('ended', onEnded);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onDuration);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
    };
  }, [loop]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    playing ? v.pause() : v.play();
  };

  const stop = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    setPlaying(false);
    status('Stopped');
  };

  const seek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = progressRef.current;
      const v = videoRef.current;
      if (!el || !v || !duration) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      v.currentTime = ratio * duration;
    },
    [duration]
  );

  const changeVolume = (val: number) => {
    const v = videoRef.current;
    setVolume(val);
    if (v) v.volume = val;
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const loadTrack = (idx: number) => {
    setTrackIndex(idx);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    status('Loading...');
    setTimeout(() => {
      videoRef.current?.load();
      status('Ready');
    }, 50);
  };

  const volBars = 20;
  const filledBars = Math.round(volume * volBars);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--win-silver)',
        userSelect: 'none',
      }}
    >
      {/* Video area */}
      <div
        style={{
          background: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1 1 auto',
          minHeight: 180,
          position: 'relative',
          boxShadow: 'inset 2px 2px 0 #404040, inset -1px -1px 0 #fff',
          margin: '4px 6px 0',
        }}
      >
        <video
          ref={videoRef}
          src={track.src}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            display: 'block',
            padding: '5px',
          }}
          loop={loop}
          preload="metadata"
        />
        {!playing && (
          <div
            style={{
              position: 'absolute',
              color: '#444',
              fontSize: 11,
              fontFamily: 'MS Sans Serif, sans-serif',
              pointerEvents: 'none',
            }}
          >
            {duration === 0 ? '▶ Double-click to play' : ''}
          </div>
        )}
      </div>

      {/* Track name */}
      <div
        style={{
          background: '#000',
          color: '#00ff00',
          fontFamily: "'VT323', monospace",
          fontSize: 13,
          padding: '2px 8px',
          margin: '0 6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>🎬 {track.title}</span>
        <span>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Seek bar */}
      <div style={{ padding: '4px 6px 2px' }}>
        <div
          ref={progressRef}
          className="progress-bar"
          style={{ cursor: 'pointer', height: 14 }}
          onMouseDown={(e) => {
            setDraggingProgress(true);
            seek(e);
          }}
          onMouseMove={(e) => {
            if (draggingProgress) seek(e);
          }}
          onMouseUp={() => setDraggingProgress(false)}
        >
          <div
            className="progress-fill"
            style={{ width: `${progress}%`, transition: 'none' }}
          />
          {/* Thumb */}
          <div
            style={{
              position: 'absolute',
              left: `${progress}%`,
              top: 0,
              width: 10,
              height: '100%',
              background: 'var(--win-silver)',
              boxShadow: 'var(--border-raised)',
              transform: 'translateX(-50%)',
              cursor: 'ew-resize',
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          padding: '4px 6px',
          flexWrap: 'wrap',
        }}
      >
        {/* Playback buttons */}
        <button
          className="btn98"
          style={{ minWidth: 0, padding: '2px 8px', fontSize: 14 }}
          onClick={() => loadTrack(Math.max(0, trackIndex - 1))}
          title="Previous"
        >
          ⏮
        </button>
        <button
          className="btn98"
          style={{ minWidth: 0, padding: '2px 8px', fontSize: 14 }}
          onClick={togglePlay}
          title={playing ? 'Pause' : 'Play'}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <button
          className="btn98"
          style={{ minWidth: 0, padding: '2px 8px', fontSize: 14 }}
          onClick={stop}
          title="Stop"
        >
          ⏹
        </button>
        <button
          className="btn98"
          style={{ minWidth: 0, padding: '2px 8px', fontSize: 14 }}
          onClick={() => loadTrack(Math.min(tracks.length - 1, trackIndex + 1))}
          title="Next"
        >
          ⏭
        </button>

        {/* Loop */}
        <button
          className="btn98"
          style={{
            minWidth: 0,
            padding: '2px 8px',
            fontSize: 14,
            background: loop ? '#000080' : undefined,
          }}
          onClick={() => setLoop((l) => !l)}
          title="Loop"
        >
          🔁
        </button>

        <div
          className="taskbar-divider"
          style={{ height: 18, margin: '0 2px' }}
        />

        {/* Volume icon + bars */}
        <button
          className="btn98"
          style={{ minWidth: 0, padding: '2px 6px', fontSize: 12 }}
          onClick={toggleMute}
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted || volume === 0 ? '🔇' : '🔊'}
        </button>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 1,
            height: 16,
            cursor: 'pointer',
          }}
          onClick={(e) => {
            const rect = (
              e.currentTarget as HTMLDivElement
            ).getBoundingClientRect();
            const ratio = Math.max(
              0,
              Math.min(1, (e.clientX - rect.left) / rect.width)
            );
            changeVolume(ratio);
          }}
        >
          {Array.from({ length: volBars }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: 4 + i * 0.5,
                background:
                  i < filledBars
                    ? i > 16
                      ? '#ff0000'
                      : i > 12
                        ? '#ffff00'
                        : '#000080'
                    : '#c0c0c0',
                boxShadow: i < filledBars ? 'none' : 'inset 1px 1px 0 #808080',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Playlist panel */}

      <div
        style={{
          margin: '0 6px 4px',
          boxShadow: 'var(--border-sunken)',
          background: '#fff',
        }}
      >
        <div
          style={{
            background: 'var(--win-blue)',
            color: '#fff',
            padding: '2px 6px',
            fontSize: 11,
            fontWeight: 'bold',
          }}
        >
          Playlist
        </div>
        {tracks.map((t, i) => (
          <div
            key={i}
            className={`listbox-item${i === trackIndex ? ' selected' : ''}`}
            style={{ fontSize: 11 }}
            onDoubleClick={() => loadTrack(i)}
            onClick={() => loadTrack(i)}
          >
            🎬 {t.title}
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div className="statusbar">
        <div className="statusbar-pane">{statusMsg}</div>
        <div className="statusbar-pane" style={{ flex: 'none', minWidth: 80 }}>
          Vol: {Math.round(volume * 100)}%
        </div>
        <div className="statusbar-pane" style={{ flex: 'none', minWidth: 80 }}>
          {duration > 0 ? `${formatTime(duration)}` : '--:--'}
        </div>
      </div>
    </div>
  );
};
