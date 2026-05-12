import { Board, Cell } from './Game';

const ROWS = 6;
const COLS = 7;

const cloneBoard = (board: Board): Board => board.map(row => [...row]);

const getPlayableRow = (board: Board, col: number): number | null => {
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (board[row][col] === null) {
      return row;
    }
  }
  return null;
};

const applyMove = (board: Board, col: number, player: Cell): Board | null => {
  if (player === null) return null;
  const row = getPlayableRow(board, col);
  if (row === null) return null;
  const next = cloneBoard(board);
  next[row][col] = player;
  return next;
};

const hasWinner = (board: Board, player: Cell): boolean => {
  if (player === null) return false;

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      if (
        col <= COLS - 4 &&
        board[row][col] === player &&
        board[row][col + 1] === player &&
        board[row][col + 2] === player &&
        board[row][col + 3] === player
      ) {
        return true;
      }

      if (
        row <= ROWS - 4 &&
        board[row][col] === player &&
        board[row + 1][col] === player &&
        board[row + 2][col] === player &&
        board[row + 3][col] === player
      ) {
        return true;
      }

      if (
        row <= ROWS - 4 &&
        col <= COLS - 4 &&
        board[row][col] === player &&
        board[row + 1][col + 1] === player &&
        board[row + 2][col + 2] === player &&
        board[row + 3][col + 3] === player
      ) {
        return true;
      }

      if (
        row >= 3 &&
        col <= COLS - 4 &&
        board[row][col] === player &&
        board[row - 1][col + 1] === player &&
        board[row - 2][col + 2] === player &&
        board[row - 3][col + 3] === player
      ) {
        return true;
      }
    }
  }

  return false;
};

const evaluateWindow = (cells: Cell[], aiPlayer: Cell, humanPlayer: Cell): number => {
  const aiCount = cells.filter(cell => cell === aiPlayer).length;
  const humanCount = cells.filter(cell => cell === humanPlayer).length;
  const emptyCount = cells.filter(cell => cell === null).length;

  if (aiCount === 4) return 100;
  if (aiCount === 3 && emptyCount === 1) return 8;
  if (aiCount === 2 && emptyCount === 2) return 3;
  if (humanCount === 3 && emptyCount === 1) return -10;
  if (humanCount === 4) return -100;
  return 0;
};

const evaluateBoard = (board: Board, aiPlayer: Cell, humanPlayer: Cell): number => {
  let score = 0;

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col <= COLS - 4; col += 1) {
      score += evaluateWindow(board[row].slice(col, col + 4), aiPlayer, humanPlayer);
    }
  }

  for (let col = 0; col < COLS; col += 1) {
    for (let row = 0; row <= ROWS - 4; row += 1) {
      score += evaluateWindow(
        [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]],
        aiPlayer,
        humanPlayer
      );
    }
  }

  for (let row = 0; row <= ROWS - 4; row += 1) {
    for (let col = 0; col <= COLS - 4; col += 1) {
      score += evaluateWindow(
        [
          board[row][col],
          board[row + 1][col + 1],
          board[row + 2][col + 2],
          board[row + 3][col + 3],
        ],
        aiPlayer,
        humanPlayer
      );
    }
  }

  for (let row = 3; row < ROWS; row += 1) {
    for (let col = 0; col <= COLS - 4; col += 1) {
      score += evaluateWindow(
        [
          board[row][col],
          board[row - 1][col + 1],
          board[row - 2][col + 2],
          board[row - 3][col + 3],
        ],
        aiPlayer,
        humanPlayer
      );
    }
  }

  return score;
};

const getValidColumns = (board: Board): number[] =>
  Array.from({ length: COLS }, (_, index) => index).filter(
    col => getPlayableRow(board, col) !== null
  );

export const pickBestMove = (board: Board, player: Cell): number => {
  const columns = getValidColumns(board);
  if (columns.length === 0) return 0;

  const opponent: Cell = player === 1 ? 2 : 1;
  let bestScore = -Infinity;
  let candidates: number[] = [];

  columns.forEach(col => {
    const next = applyMove(board, col, player);
    if (!next) return;
    const score = evaluateBoard(next, player, opponent);
    if (score > bestScore) {
      bestScore = score;
      candidates = [col];
    } else if (score === bestScore) {
      candidates.push(col);
    }
  });

  if (candidates.length === 0) return columns[0];
  return candidates[Math.floor(Math.random() * candidates.length)];
};

export const minimax = (
  board: Board,
  depth: number,
  maximizingPlayer: boolean,
  player1: Cell,
  player2: Cell
): [number | null, number] => {
  const validColumns = getValidColumns(board);
  const terminal =
    hasWinner(board, player1) || hasWinner(board, player2) || validColumns.length === 0;

  if (depth === 0 || terminal) {
    if (hasWinner(board, player2)) return [null, 1_000_000];
    if (hasWinner(board, player1)) return [null, -1_000_000];
    if (validColumns.length === 0) return [null, 0];
    return [null, evaluateBoard(board, player2, player1)];
  }

  if (maximizingPlayer) {
    let bestCol: number | null = validColumns[0] ?? null;
    let bestScore = -Infinity;

    validColumns.forEach(col => {
      const next = applyMove(board, col, player2);
      if (!next) return;
      const [, score] = minimax(next, depth - 1, false, player1, player2);
      if (score > bestScore) {
        bestScore = score;
        bestCol = col;
      }
    });

    return [bestCol, bestScore];
  }

  let bestCol: number | null = validColumns[0] ?? null;
  let bestScore = Infinity;

  validColumns.forEach(col => {
    const next = applyMove(board, col, player1);
    if (!next) return;
    const [, score] = minimax(next, depth - 1, true, player1, player2);
    if (score < bestScore) {
      bestScore = score;
      bestCol = col;
    }
  });

  return [bestCol, bestScore];
};
