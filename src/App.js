import React, { useState, useRef, useEffect } from 'react';

const ROWS = 50;
const COLS = 50;
const CELL_SIZE = 10;

function GameOfLife() {
  const [grid, setGrid] = useState(() => {
    const rows = new Array(ROWS);
    for (let i = 0; i < ROWS; i++) {
      rows[i] = new Array(COLS).fill(false);
    }
    return rows;
  });

  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const requestRef = useRef();

  const canvasRef = useRef(null);

  const handleCellClick = (row, col) => {
    if (isRunning) {
      return;
    }
    const newGrid = [...grid];
    newGrid[row][col] = !newGrid[row][col];
    setGrid(newGrid);
    drawGrid();
  };

  const handleClear = () => {
    setIsRunning(false);
    setGeneration(0);
    setGrid(prevGrid => {
      return prevGrid.map(row => row.fill(false));
    });
  };

  const handleRandomize = () => {
    setIsRunning(false);
    setGeneration(0);
    drawGrid();
    setGrid(prevGrid => {
      return prevGrid.map(row =>
        row.map(cell => Math.random() > 0.5)
      );
    });
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const countNeighbors = (row, col) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        const r = (row + i + ROWS) % ROWS;
        const c = (col + j + COLS) % COLS;
        if (grid[r][c]) {
          count++;
        }
      }
    }
    return count;
  };

  const updateGrid = () => {
    setGrid(prevGrid => {
      const newGrid = new Array(ROWS);
      for (let i = 0; i < ROWS; i++) {
        newGrid[i] = new Array(COLS);
        for (let j = 0; j < COLS; j++) {
          const numNeighbors = countNeighbors(i, j);
          if (prevGrid[i][j] && (numNeighbors < 2 || numNeighbors > 3)) {
            newGrid[i][j] = false;
          } else if (!prevGrid[i][j] && numNeighbors === 3) {
            newGrid[i][j] = true;
          } else {
            newGrid[i][j] = prevGrid[i][j];
          }
        }
      }
      return newGrid;
    });
    setGeneration(prevGeneration => prevGeneration + 1);
    drawGrid();
  };

const drawGrid = () => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log(grid);
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (grid[i][j]) {
        ctx.fillStyle = '#000000';
      } else {
        ctx.fillStyle = '#FFFFFF';
      }
      ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
};
useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(updateGrid);
      drawGrid();
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={COLS * CELL_SIZE}
        height={ROWS * CELL_SIZE}
        onClick={event => {
          const rect = canvasRef.current.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const col = Math.floor(x / CELL_SIZE);
          const row = Math.floor(y / CELL_SIZE);
          handleCellClick(row, col);
        }}
      ></canvas>
      <div>
        <button onClick={handleStart}>Start</button>
        <button onClick={handleStop}>Stop</button>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleRandomize}>Randomize</button>
        <span>Generation: {generation}</span>
      </div>
    </div>
  );
}

export default GameOfLife;