import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as BoardBlackLarge } from '../../assets/images/board-layer-black-large.svg';
import { ReactComponent as BoardBlackSmall } from '../../assets/images/board-layer-black-small.svg';
import { ReactComponent as BoardWhiteLarge } from '../../assets/images/board-layer-white-large.svg';
import { ReactComponent as BoardWhiteSmall } from '../../assets/images/board-layer-white-small.svg';
import { ReactComponent as TokenRedLarge } from '../../assets/images/counter-red-large.svg';
import { ReactComponent as TokenRedSmall } from '../../assets/images/counter-red-small.svg';
import { ReactComponent as TokenYellowLarge } from '../../assets/images/counter-yellow-large.svg';
import { ReactComponent as TokenYellowSmall } from '../../assets/images/counter-yellow-small.svg';
import { GameContext } from '../App';
import { GameHeader } from '../GameHeader/GameHeader';
import { ModalMenuGame } from '../ModalMenuGame/ModalMenuGame';
import { Players } from '../Players/Players';
import scss from './Game.module.scss';
import { minimax, pickBestMove } from './gameWithAILogic';

export type Cell = null | 1 | 2;
export type Board = Cell[][];

const ROWS = 6;
const COLUMNS = 7;
const TURN_SECONDS = 30;

const createInitialBoard = (): Board =>
  Array.from({ length: ROWS }, () => Array.from({ length: COLUMNS }, () => null));

const findWinningTokens = (
  board: Board,
  player: Cell
): { row: number; col: number }[] | null => {
  if (player === null) return null;

  const directions = [
    { dr: 0, dc: 1 },
    { dr: 1, dc: 0 },
    { dr: 1, dc: 1 },
    { dr: 1, dc: -1 },
  ];

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLUMNS; col += 1) {
      for (const { dr, dc } of directions) {
        const chain: { row: number; col: number }[] = [];

        for (let i = 0; i < 4; i += 1) {
          const nextRow = row + dr * i;
          const nextCol = col + dc * i;
          if (
            nextRow < 0 ||
            nextRow >= ROWS ||
            nextCol < 0 ||
            nextCol >= COLUMNS ||
            board[nextRow][nextCol] !== player
          ) {
            chain.length = 0;
            break;
          }
          chain.push({ row: nextRow, col: nextCol });
        }

        if (chain.length === 4) return chain;
      }
    }
  }

  return null;
};

const boardIsFull = (board: Board): boolean =>
  board.every(row => row.every(cell => cell !== null));

const placeDisc = (
  board: Board,
  col: number,
  player: Cell
): { board: Board; row: number } | null => {
  if (player === null) return null;

  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (board[row][col] === null) {
      const next = board.map(currentRow => [...currentRow]);
      next[row][col] = player;
      return { board: next, row };
    }
  }

  return null;
};

export const Game = () => {
  const { playerVsPlayer } = useContext(GameContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [roundActive, setRoundActive] = useState(true);
  const [isPlayerOneTurn, setIsPlayerOneTurn] = useState(true);
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [markerPosition, setMarkerPosition] = useState(632 / 2);
  const [counter, setCounter] = useState(TURN_SECONDS);
  const [pointsPlayerOne, setPointsPlayerOne] = useState(0);
  const [pointsPlayerTwo, setPointsPlayerTwo] = useState(0);
  const [pointsYou, setPointsYou] = useState(0);
  const [pointsCpu, setPointsCpu] = useState(0);
  const [draw, setDraw] = useState(false);
  const [winner, setWinner] = useState<Cell>(null);
  const [gameBoard, setGameBoard] = useState<Board>(() => createInitialBoard());
  const [winningTokens, setWinningTokens] = useState<{ row: number; col: number }[]>([]);

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1279 });
  const isDesktop = useMediaQuery({ minWidth: 1280 });

  const activePlayer = playerVsPlayer
    ? (isPlayerOneTurn ? 1 : 2)
    : (isUserTurn ? 1 : 2);

  const announceWinner = useCallback(
    (winnerPlayer: Cell) => {
      if (winnerPlayer === null) return;

      setWinner(winnerPlayer);
      setRoundActive(false);

      if (playerVsPlayer) {
        if (winnerPlayer === 1) {
          setPointsPlayerOne(prev => prev + 1);
        } else {
          setPointsPlayerTwo(prev => prev + 1);
        }
      } else if (winnerPlayer === 1) {
        setPointsYou(prev => prev + 1);
      } else {
        setPointsCpu(prev => prev + 1);
      }
    },
    [playerVsPlayer]
  );

  const resetRound = useCallback(() => {
    setRoundActive(true);
    setDraw(false);
    setWinner(null);
    setWinningTokens([]);
    setCounter(TURN_SECONDS);
    setIsPlayerOneTurn(true);
    setIsUserTurn(true);
    setGameBoard(createInitialBoard());
    setMenuOpen(false);
  }, []);

  const restartMatch = useCallback(() => {
    setPointsPlayerOne(0);
    setPointsPlayerTwo(0);
    setPointsYou(0);
    setPointsCpu(0);
    resetRound();
  }, [resetRound]);

  const processMove = useCallback(
    (column: number, player: Cell) => {
      const move = placeDisc(gameBoard, column, player);
      if (!move) return false;

      const nextBoard = move.board;
      setGameBoard(nextBoard);

      const tokens = findWinningTokens(nextBoard, player);
      if (tokens) {
        setWinningTokens(tokens);
        announceWinner(player);
        return true;
      }

      if (boardIsFull(nextBoard)) {
        setDraw(true);
        setRoundActive(false);
        return true;
      }

      if (playerVsPlayer) {
        setIsPlayerOneTurn(prev => !prev);
      } else {
        setIsUserTurn(prev => !prev);
      }
      setCounter(TURN_SECONDS);
      return true;
    },
    [announceWinner, gameBoard, playerVsPlayer]
  );

  const handleColumnClick = (columnIndex: number) => {
    if (!roundActive) return;
    if (!playerVsPlayer && !isUserTurn) return;
    processMove(columnIndex, activePlayer);
  };

  useEffect(() => {
    if (!roundActive || draw || menuOpen) return;
    const timerId = window.setInterval(() => {
      setCounter(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [draw, menuOpen, roundActive]);

  useEffect(() => {
    if (!roundActive || counter > 0) return;
    const timeoutWinner: Cell = activePlayer === 1 ? 2 : 1;
    announceWinner(timeoutWinner);
  }, [activePlayer, announceWinner, counter, roundActive]);

  useEffect(() => {
    if (playerVsPlayer || isUserTurn || !roundActive || draw || menuOpen) return;

    const timerId = window.setTimeout(() => {
      const usedCells = gameBoard.flat().filter(cell => cell !== null).length;
      let chosenColumn: number | null = null;

      if (usedCells < 3) {
        chosenColumn = pickBestMove(gameBoard, 2);
      } else {
        [chosenColumn] = minimax(gameBoard, 5, true, 1, 2);
      }

      if (chosenColumn !== null) {
        processMove(chosenColumn, 2);
      }
    }, 500);

    return () => window.clearTimeout(timerId);
  }, [draw, gameBoard, isUserTurn, menuOpen, playerVsPlayer, processMove, roundActive]);

  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [menuOpen]);

  useEffect(() => {
    const boardContainer = document.querySelector(`.${scss.game__boardContainer}`);
    if (!(boardContainer instanceof HTMLElement) || !roundActive) return;

    const onMove = (event: MouseEvent) => {
      const rect = boardContainer.getBoundingClientRect();
      const columnWidth = rect.width / COLUMNS;
      const relativeX = Math.max(0, Math.min(rect.width - 1, event.clientX - rect.left));
      const columnIndex = Math.floor(relativeX / columnWidth);
      setMarkerPosition(columnIndex * columnWidth + columnWidth / 2);
    };

    boardContainer.addEventListener('mousemove', onMove);
    return () => boardContainer.removeEventListener('mousemove', onMove);
  }, [roundActive]);

  const isRedTurn = playerVsPlayer ? isPlayerOneTurn : isUserTurn;

  const turnClasses = `${scss.game__turn} ${isRedTurn ? scss['game__turn-rose'] : scss['game__turn-yellow']}`;
  const markerClasses = `${scss.game__marker} ${isRedTurn ? scss['game__marker-rose'] : scss['game__marker-yellow']}`;

  const gameStyle = [
    scss.game,
    isMobile ? scss.gameMobile : '',
    isTablet ? scss.gameTablet : '',
    isDesktop ? scss.gameDesktop : '',
  ]
    .filter(Boolean)
    .join(' ');

  const boardStyle = [
    scss.game__board,
    isMobile ? scss.gameMobile__board : '',
    isTablet ? scss.gameTablet__board : '',
    isDesktop ? scss.gameDesktop__board : '',
  ]
    .filter(Boolean)
    .join(' ');

  const winsStyle = [
    scss.game__wins,
    isMobile ? scss.gameMobile__wins : '',
    isTablet ? scss.gameTablet__wins : '',
    isDesktop ? scss.gameDesktop__wins : '',
  ]
    .filter(Boolean)
    .join(' ');

  const bottomBarStyle = [
    scss.game__bottomBar,
    isMobile ? scss.gameMobile__bottomBar : '',
    isTablet ? scss.gameTablet__bottomBar : '',
    isDesktop ? scss.gameDesktop__bottomBar : '',
    !roundActive
      ? winner === 1
        ? scss['game__bottomBar-rose']
        : scss['game__bottomBar-yellow']
      : '',
  ]
    .filter(Boolean)
    .join(' ');

  const turnBlockClass = [
    turnClasses,
    !playerVsPlayer ? (isUserTurn ? scss['game__turn-rose'] : scss['game__turn-yellow']) : '',
    isMobile ? scss.gameMobile__turn : '',
    isTablet ? scss.gameTablet__turn : '',
    isDesktop ? scss.gameDesktop__turn : '',
  ]
    .filter(Boolean)
    .join(' ');

  const winnerName = useMemo(() => {
    if (draw) return 'NO WINNER';
    if (playerVsPlayer) return winner === 1 ? 'PLAYER 1' : 'PLAYER 2';
    return winner === 1 ? 'YOU' : 'CPU';
  }, [draw, playerVsPlayer, winner]);

  const playerTurnLabel = playerVsPlayer
    ? isPlayerOneTurn
      ? 'PLAYER 1’S TURN'
      : 'PLAYER 2’S TURN'
    : isUserTurn
      ? 'YOUR TURN'
      : 'CPU’S TURN';

  const getCellStyle = (rowIndex: number, colIndex: number) => {
    const topDesktop = `${17 + rowIndex * (70 + 18)}px`;
    const topMobile = `${6 + rowIndex * (41 + 6)}px`;

    return {
      position: 'absolute' as const,
      top: isMobile ? topMobile : topDesktop,
      left: isMobile ? `${6 + colIndex * (41 + 5.9)}px` : `${17 + colIndex * (70 + 18)}px`,
      width: `${isMobile ? 41 : 70}px`,
      height: `${isMobile ? 41 : 70}px`,
      ['--final-top' as const]: isMobile ? topMobile : topDesktop,
    };
  };

  return (
    <>
      <div className={gameStyle}>
        <GameHeader onClickMenu={() => setMenuOpen(true)} onClickRestart={restartMatch} />
        <Players
          pointsPlayerOne={pointsPlayerOne}
          pointsPlayerTwo={pointsPlayerTwo}
          pointsYou={pointsYou}
          pointsCpu={pointsCpu}
        />

        <div className={boardStyle}>
          <div className={scss.game__boardContainer}>
            {isDesktop && (
              <div
                className={markerClasses}
                style={{ left: `${markerPosition}px`, transition: 'all 0.25s ease-in-out' }}
              />
            )}

            <div className={scss.game__boardBlack}>
              {(isDesktop || isTablet) && <BoardBlackLarge />}
              {isMobile && <BoardBlackSmall />}
            </div>

            <div className={scss.game__rc}>
              {gameBoard.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isWinningToken = winningTokens.some(
                    token => token.row === rowIndex && token.col === colIndex
                  );

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`${scss.game__token} ${cell ? scss.tokenDropAnimation : ''}`}
                      style={getCellStyle(rowIndex, colIndex)}
                      onClick={() => handleColumnClick(colIndex)}
                    >
                      {cell === 1 && (
                        <div className={scss.game__tokensContainer}>
                          {(isDesktop || isTablet) && <TokenRedLarge className={scss.game__tokenIcon} />}
                          {isMobile && <TokenRedSmall className={scss.game__tokenIcon} />}
                          {isWinningToken && (
                            <div
                              className={
                                isMobile
                                  ? scss.game__tokenCircleMobile
                                  : scss.game__tokenCircleDesktop
                              }
                            />
                          )}
                        </div>
                      )}

                      {cell === 2 && (
                        <div className={scss.game__tokensContainer}>
                          {(isDesktop || isTablet) && (
                            <TokenYellowLarge className={scss.game__tokenIcon} />
                          )}
                          {isMobile && <TokenYellowSmall className={scss.game__tokenIcon} />}
                          {isWinningToken && (
                            <div
                              className={
                                isMobile
                                  ? scss.game__tokenCircleMobile
                                  : scss.game__tokenCircleDesktop
                              }
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className={scss.game__boardWhite}>
              {(isDesktop || isTablet) && <BoardWhiteLarge />}
              {isMobile && <BoardWhiteSmall />}
            </div>
          </div>
        </div>

        {roundActive ? (
          <div className={turnBlockClass}>
            <p className={scss.game__turnText}>{playerTurnLabel}</p>
            <p className={scss.game__turnCounter}>{counter}s</p>
          </div>
        ) : (
          <div className={winsStyle}>
            <p className={scss.game__winsPlayer}>{winnerName}</p>
            <p className={scss.game__winsWins}>{draw ? 'DRAW' : 'WINS'}</p>
            <button type="button" className={scss.game__winsButton} onClick={resetRound}>
              PLAY AGAIN
            </button>
          </div>
        )}

        <div className={bottomBarStyle}></div>
      </div>

      <div
        className={`${scss.backgroundMenu} ${menuOpen ? '' : scss['is-hidden']}`}
        onClick={event => {
          if (event.currentTarget === event.target) {
            setMenuOpen(false);
          }
        }}
      >
        <ModalMenuGame
          onClickContinue={() => setMenuOpen(false)}
          onClickRestart={restartMatch}
          onClickQuit={() => {
            restartMatch();
            navigate('/');
          }}
        />
      </div>
    </>
  );
};
