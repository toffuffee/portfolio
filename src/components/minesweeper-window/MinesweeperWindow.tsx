import React, { useState } from "react";

type Cell = {
  hasMine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacentMines: number;
};

const ROWS = 8;
const COLS = 8;
const MINES = 10;

export const MinesweeperWindow: React.FC = () => {
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);

  const initGrid = (): Cell[][] => {
    const newGrid: Cell[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({
        hasMine: false,
        revealed: false,
        flagged: false,
        adjacentMines: 0,
      })),
    );

    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].hasMine) {
        newGrid[r][c].hasMine = true;
        minesPlaced++;
      }
    }

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newGrid[r][c].hasMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (
                nr >= 0 &&
                nr < ROWS &&
                nc >= 0 &&
                nc < COLS &&
                newGrid[nr][nc].hasMine
              ) {
                count++;
              }
            }
          }
          newGrid[r][c].adjacentMines = count;
        }
      }
    }

    return newGrid;
  };

  const [grid, setGrid] = useState<Cell[][]>(() => initGrid());

  const revealCell = (r: number, c: number) => {
    if (gameOver || victory) return;
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    const dfs = (r: number, c: number) => {
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
      const cell = newGrid[r][c];
      if (cell.revealed || cell.flagged) return;
      cell.revealed = true;
      if (cell.adjacentMines === 0 && !cell.hasMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr !== 0 || dc !== 0) dfs(r + dr, c + dc);
          }
        }
      }
    };

    if (newGrid[r][c].hasMine) {
      setGameOver(true);
      newGrid.forEach((row) =>
        row.forEach((cell) => {
          if (cell.hasMine) cell.revealed = true;
        }),
      );
    } else {
      dfs(r, c);
    }

    const unrevealedCells = newGrid
      .flat()
      .filter((cell) => !cell.revealed && !cell.hasMine);
    if (unrevealedCells.length === 0) {
      setVictory(true);
      newGrid.forEach((row) =>
        row.forEach((cell) => {
          if (cell.hasMine) cell.revealed = true;
        }),
      );
    }

    setGrid(newGrid);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || victory) return;
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    const cell = newGrid[r][c];
    if (!cell.revealed) cell.flagged = !cell.flagged;
    setGrid(newGrid);
  };

  const restartGame = () => {
    setGrid(initGrid());
    setGameOver(false);
    setVictory(false);
  };

  return (
    <div style={{ padding: 10, position: "relative" }}>
      <div
        className="window-btn"
        style={{
          textAlign: "center",
          width: "40px",
          height: "40px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <span
          style={{ fontSize: 24, cursor: "pointer", userSelect: "none" }}
          onClick={restartGame}
          role="button"
          aria-label="Restart Game"
        >
          🙂
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 30px)`,
          gap: 2,
          marginTop: 10,
          justifyContent: "center",
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => revealCell(r, c)}
              onContextMenu={(e) => toggleFlag(e, r, c)}
              style={{
                width: 30,
                height: 30,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: cell.revealed ? "#ddd" : "#999",
                border: "1px solid #555",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {cell.revealed
                ? cell.hasMine
                  ? "💣"
                  : cell.adjacentMines || ""
                : cell.flagged
                  ? "🚩"
                  : ""}
            </div>
          )),
        )}
      </div>
      {gameOver && (
        <div style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
          💥 Поражение!
        </div>
      )}
      {victory && (
        <div style={{ color: "green", textAlign: "center", marginTop: "20px" }}>
          🏆 Победа!
        </div>
      )}
    </div>
  );
};
