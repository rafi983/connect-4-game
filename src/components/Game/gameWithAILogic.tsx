import { Cell } from './Game';
import { Board } from './Game';

const countTokens = (
  board: Board,
  row: number,
  col: number,
  deltaRow: number,
  deltaCol: number,
  player: Cell
): number => {
  let count = 0;
  for (let i = 0; i < 4; i++) {
    if (
      row >= 0 &&
      row < board.length &&
      col >= 0 &&
      col < board[0].length &&
      board[row][col] === player
    ) {
      count++;
    }
    row += deltaRow;
    col += deltaCol;
  }
  return count;
};

const evaluateMove = (
  board: Board,
  row: number,
  col: number,
  player: Cell,
  winScore: number,
  potentialWinScore: number,
  blockScore: number
): number => {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  let score = 0;
  directions.forEach(([deltaRow, deltaCol]) => {
    const count = countTokens(board, row, col, deltaRow, deltaCol, player);
    if (count === 4) {
      score += winScore;
      score += potentialWinScore;
    } else if (count === 2) {
      score += blockScore;
    }
  });
  return score;
};

const evaluatePosition = (
  board: Board,
  row: number,
  col: number,
  player: Cell
): number => {
  const opponent = player === 1 ? 2 : 1;
  let score = 0;

  score += evaluateMove(board, row, col, player, 1500, 150, 15);
  score -= evaluateMove(board, row, col, opponent, 1200, 120, 12);

  if (col === 3) score += 100;

  return score;
};

const evaluateBoard = (board: Board, player: Cell): number => {
  let score = 0;
  const opponent = player === 1 ? 2 : 1;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === null) {
        score += evaluatePosition(board, row, col, player);
        score -= evaluatePosition(board, row, col, opponent);
      }
    }
  }

  return score;
};

const getNextPlayableRow = (board: Board, col: number): number | undefined => {
  for (let r = 5; r >= 0; r--) {
    if (board[r][col] === null) {
      return r;
    }
  }
};

const checkVertical = (board: Board, player: Cell): boolean => {
  for (let r = 3; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      if (
        board[r][c] === player &&
        board[r - 1][c] === player &&
        board[r - 2][c] === player &&
        board[r - 3][c] === player
      ) {
        return true;
      }
    }
  }
  return false;
};

const checkHorizontal = (board: Board, player: Cell): boolean => {
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 4; c++) {
      if (
        board[r][c] === player &&
        board[r][c + 1] === player &&
        board[r][c + 2] === player &&
        board[r][c + 3] === player
      ) {
        return true;
      }
    }
  }
  return false;
};

const checkDiagonalRight = (board: Board, player: Cell): boolean => {
  for (let r = 3; r < 6; r++) {
    for (let c = 0; c < 4; c++) {
      if (
        board[r][c] === player &&
        board[r - 1][c + 1] === player &&
        board[r - 2][c + 2] === player &&
        board[r - 3][c + 3] === player
      ) {
        return true;
      }
    }
  }
  return false;
};

const checkDiagonalLeft = (board: Board, player: Cell): boolean => {
  for (let r = 3; r < 6; r++) {
    for (let c = 3; c < 7; c++) {
      if (
        board[r][c] === player &&
        board[r - 1][c - 1] === player &&
        board[r - 2][c - 2] === player &&
        board[r - 3][c - 3] === player
      ) {
        return true;
      }
    }
  }
  return false;
};

const isWinner = (board: Board, player: Cell): boolean => {
  return (
    checkVertical(board, player) ||
    checkHorizontal(board, player) ||
    checkDiagonalRight(board, player) ||
    checkDiagonalLeft(board, player)
  );
};

const makeMove = (
  board: Board,
  row: number,
  col: number,
  player: Cell
): Board => {
  const newBoard = [...board.map(row => [...row])];
  newBoard[row][col] = player;
  return newBoard;
};

const findWinner = (
  board: Board,
  player1: Cell,
  player2: Cell
): Cell | null => {
  if (isWinner(board, player1)) {
    return player1;
  }

  if (isWinner(board, player2)) {
    return player2;
  }

  return null;
};

export const pickBestMove = (board: Board, player: Cell): number => {
  let topMoves: { col: number; score: number }[] = [];
  let maxScore = -Infinity;

  for (let col = 0; col < board[0].length; col++) {
    const row = getNextPlayableRow(board, col);
    if (row !== undefined) {
      const tempBoard = makeMove(board, row, col, player);
      const score = evaluatePosition(tempBoard, row, col, player);

      if (score > maxScore) {
        topMoves = [{ col, score }];
        maxScore = score;
      } else if (score === maxScore) {
        topMoves.push({ col, score });
      }
    }
  }

  if (topMoves.length > 1) {
    const randomIndex = Math.floor(Math.random() * topMoves.length);
    return topMoves[randomIndex].col;
  }

  return topMoves.length > 0 ? topMoves[0].col : 0;
};

export const minimax = (
  board: Board,
  depth: number,
  maximizingPlayer: boolean,
  player1: Cell,
  player2: Cell
): [number | null, number] => {
  const winner = findWinner(board, player1, player2);
  if (depth === 0 || winner !== null) {
    if (winner === player2) {
      return [null, 1000000];
    } else if (winner === player1) {
      return [null, -1000000];
    } else {
      return [null, 0];
    }
  }

  if (maximizingPlayer) {
    let value = -Infinity;
    let column = null;
    for (let col = 0; col < 7; col++) {
      const row = getNextPlayableRow(board, col);
      if (row !== undefined) {
        const tempBoard = makeMove(board, row, col, player2);
        const [, score] = minimax(
          tempBoard,
          depth - 1,
          false,
          player1,
          player2
        );
        const boardScore = evaluateBoard(tempBoard, player2);
        const totalScore = score + boardScore;
        if (score > value) {
          value = totalScore;
          column = col;
        }
      }
    }
    return [column, value];
  } else {
    let value = Infinity;
    let column = null;
    for (let col = 0; col < 7; col++) {
      const row = getNextPlayableRow(board, col);
      if (row !== undefined) {
        const tempBoard = makeMove(board, row, col, player1);
        const [, score] = minimax(tempBoard, depth - 1, true, player1, player2);
        const boardScore = evaluateBoard(tempBoard, player2);
        const totalScore = score + boardScore;
        if (score < value) {
          value = totalScore;
          column = col;
        }
      }
    }
    return [column, value];
  }
};
