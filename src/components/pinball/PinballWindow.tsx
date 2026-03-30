import React, { useRef, useEffect, useState } from 'react';

const ROWS = 5;
const COLS = 8;
const BLOCK_WIDTH = 50;
const BLOCK_HEIGHT = 20;
const BALL_SIZE = 15;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 15;

type Block = { x: number; y: number; alive: boolean };

export const PinballWindow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);

  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const paddleX = useRef(150);
  const ball = useRef({ x: 150, y: 200, dx: 2, dy: -2 });
  const blocks = useRef<Block[]>(
    Array.from({ length: ROWS * COLS }, (_, idx) => ({
      x: (idx % COLS) * (BLOCK_WIDTH + 5) + 20,
      y: Math.floor(idx / COLS) * (BLOCK_HEIGHT + 5) + 20,
      alive: true,
    }))
  );

  const restartGame = () => {
    blocks.current = Array.from({ length: ROWS * COLS }, (_, idx) => ({
      x: (idx % COLS) * (BLOCK_WIDTH + 5) + 20,
      y: Math.floor(idx / COLS) * (BLOCK_HEIGHT + 5) + 20,
      alive: true,
    }));
    ball.current = { x: 150, y: 200, dx: 2, dy: -2 };
    paddleX.current = 150;
    setGameOver(false);
    setVictory(false);
    setGameStarted(false);
  };

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      blocks.current.forEach((block) => {
        if (block.alive) {
          ctx.fillStyle = '#0078d7';
          ctx.fillRect(block.x, block.y, BLOCK_WIDTH, BLOCK_HEIGHT);
          ctx.strokeStyle = '#000';
          ctx.strokeRect(block.x, block.y, BLOCK_WIDTH, BLOCK_HEIGHT);
        }
      });

      const b = ball.current;
      ctx.beginPath();
      ctx.arc(b.x, b.y, BALL_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.closePath();

      ctx.fillStyle = '#555';
      ctx.fillRect(
        paddleX.current,
        canvas.height - PADDLE_HEIGHT - 10,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
      );

      // eslint-disable-next-line prefer-const
      let { x, y, dx, dy } = b;

      if (x + dx > canvas.width - BALL_SIZE / 2 || x + dx < BALL_SIZE / 2)
        dx = -dx;
      if (y + dy < BALL_SIZE / 2) dy = -dy;

      if (y + dy > canvas.height - PADDLE_HEIGHT - 10 - BALL_SIZE / 2) {
        const paddleLeft = paddleX.current - BALL_SIZE / 2;
        const paddleRight = paddleX.current + PADDLE_WIDTH + BALL_SIZE / 2;

        if (x > paddleLeft && x < paddleRight) {
          dy = -dy;
          const hitPos = (x - paddleX.current) / PADDLE_WIDTH;
          dx = 4 * (hitPos - 0.5);
        }
      }

      if (y > canvas.height + 40) {
        setGameOver(true);
        return;
      }

      let allDead = true;
      blocks.current.forEach((block) => {
        if (!block.alive) return;
        allDead = false;

        const collidedX =
          x + BALL_SIZE / 2 > block.x &&
          x - BALL_SIZE / 2 < block.x + BLOCK_WIDTH;
        const collidedY =
          y + BALL_SIZE / 2 > block.y &&
          y - BALL_SIZE / 2 < block.y + BLOCK_HEIGHT;

        if (collidedX && collidedY) {
          const prevX = x - dx;
          const prevY = y - dy;

          const hitFromLeft = prevX + BALL_SIZE / 2 <= block.x;
          const hitFromRight = prevX - BALL_SIZE / 2 >= block.x + BLOCK_WIDTH;
          const hitFromTop = prevY + BALL_SIZE / 2 <= block.y;
          const hitFromBottom = prevY - BALL_SIZE / 2 >= block.y + BLOCK_HEIGHT;

          if (hitFromLeft || hitFromRight) dx = -dx;
          if (hitFromTop || hitFromBottom) dy = -dy;

          block.alive = false;
        }
      });

      if (allDead) {
        setVictory(true);
        return;
      }

      ball.current = { x: x + dx, y: y + dy, dx, dy };
      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameStarted, gameOver, victory]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    let x = e.clientX - rect.left - PADDLE_WIDTH / 2;
    const canvasWidth = canvasRef.current?.width || 0;
    x = Math.max(0, Math.min(x, canvasWidth - PADDLE_WIDTH));
    paddleX.current = x;

    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'none';
    }
  };

  return (
    <div style={{ padding: 10, position: 'relative', textAlign: 'center' }}>
      {!gameStarted && (
        <div
          style={{
            width: '100%',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            margin: '0 auto',
            userSelect: 'none',
          }}
        >
          <h1>🕹 Pinball Game 🕹</h1>
          <button
            onClick={() => setGameStarted(true)}
            style={{
              background: 'var(--win-silver)',
              border: 'none',
              boxShadow: 'var(--border-raised)',
              textAlign: 'center',
              width: '90px',
              height: '40px',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '30px',
            }}
          >
            Start Game
          </button>
        </div>
      )}

      {gameStarted && (
        <>
          <div style={{ marginBottom: 10 }}>
            <button
              onClick={restartGame}
              style={{
                background: 'var(--win-silver)',
                border: 'none',
                boxShadow: 'var(--border-raised)',
                textAlign: 'center',
                width: '40px',
                height: '40px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              🕹
            </button>
          </div>

          <canvas
            ref={canvasRef}
            width={COLS * (BLOCK_WIDTH + 5) + 40}
            height={400}
            style={{
              border: '2px solid #555',
              display: 'block',
              margin: '0 auto',
            }}
            onMouseMove={handleMouseMove}
          />

          {gameOver && (
            <div
              style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}
            >
              💥 Game Over!
            </div>
          )}
          {victory && (
            <div
              style={{ color: 'green', textAlign: 'center', marginTop: '20px' }}
            >
              🏆 Victory!
            </div>
          )}
        </>
      )}
    </div>
  );
};
