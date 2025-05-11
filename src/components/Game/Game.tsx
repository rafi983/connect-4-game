import scss from './Game.module.scss';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Players } from '../Players/Players';
import { GameHeader } from '../GameHeader/GameHeader';
import { ModalMenuGame } from '../ModalMenuGame/ModalMenuGame';
import { ReactComponent as BoardBlackLarge } from '../../assets/images/board-layer-black-large.svg';
import { ReactComponent as BoardWhiteLarge } from '../../assets/images/board-layer-white-large.svg';
import { ReactComponent as BoardBlackSmall } from '../../assets/images/board-layer-black-small.svg';
import { ReactComponent as BoardWhiteSmall } from '../../assets/images/board-layer-white-small.svg';
import { ReactComponent as TokenRedLarge } from '../../assets/images/counter-red-large.svg';
import { ReactComponent as TokenRedSmall } from '../../assets/images/counter-red-small.svg';
import { ReactComponent as TokenYellowLarge } from '../../assets/images/counter-yellow-large.svg';
import { ReactComponent as TokenYellowSmall } from '../../assets/images/counter-yellow-small.svg';
import { GameContext } from '../App';
import { pickBestMove } from './gameWithAILogic';
import { minimax } from './gameWithAILogic';

export type Cell = null | 1 | 2;
export type Board = Cell[][];

export const Game = () => {
  const { playerVsPlayer } = useContext(GameContext);
  const [isOpened, setIsOpened] = useState(false);
  const navigate = useNavigate();
  const [game, setGame] = useState(true);
  const [winsPlayerOne, setWinsPlayerOne] = useState(false);
  const [winsYou, setWinsYou] = useState(false);
  const [playerOne, setPlayerOne] = useState(true);
  const [you, setYou] = useState(true);
  const initialMarkerPosition = 632 / 2;
  const [markerPosition, setMarkerPosition] = useState(initialMarkerPosition);
  const [counter, setCounter] = useState(30);
  const [pointsPlayerOne, setPointsPlayerOne] = useState(0);
  const [pointsPlayerTwo, setPointsPlayerTwo] = useState(0);
  const [pointsYou, setPointsYou] = useState(0);
  const [pointsCpu, setPointsCpu] = useState(0);
  const [draw, setDraw] = useState(false);

  const ROWS = 6;
  const COLUMNS = 7;

  const initialBoard: Cell[][] = Array.from({ length: ROWS }, () =>
    Array(COLUMNS).fill(null)
  );

  const [gameBoard, setGameBoard] = useState<Cell[][]>(initialBoard);
  const [winningTokens, setWinningTokens] = useState<
    { row: number; col: number }[]
  >([]);
  const [gameOver, setGameOver] = useState(false);

  const checkLine = useCallback(
    (
      board: Cell[][],
      startRow: number,
      startCol: number,
      deltaRow: number,
      deltaCol: number,
      player: Cell
    ): { row: number; col: number }[] | null => {
      let tokens = [];
      let r = startRow,
        c = startCol;

      while (r >= 0 && r < ROWS && c >= 0 && c < COLUMNS) {
        if (board[r][c] === player) {
          tokens.push({ row: r, col: c });
          if (tokens.length === 4) {
            return tokens;
          }
        } else {
          tokens = [];
        }
        r += deltaRow;
        c += deltaCol;
      }

      return null;
    },
    [ROWS, COLUMNS]
  );

  const checkForAdjacentTokens = useCallback(
    (
      board: Cell[][],
      row: number,
      col: number,
      player: Cell
    ): { row: number; col: number }[] | null => {
      let tokens = checkLine(board, row, Math.max(0, col - 3), 0, 1, player);
      if (tokens) return tokens;

      tokens = checkLine(board, Math.max(0, row - 3), col, 1, 0, player);
      if (tokens) return tokens;

      for (let i = -3; i <= 3; i++) {
        tokens = checkLine(board, row + i, col + i, 1, 1, player);
        if (tokens) return tokens;

        tokens = checkLine(board, row + i, col - i, 1, -1, player);
        if (tokens) return tokens;
      }

      return null;
    },
    [checkLine]
  );

  const addTokenToColumn = useCallback(
    (column: number, player: Cell) => {
      const newBoard = [...gameBoard];
      let addedRow = -1;
      for (let row = ROWS - 1; row >= 0; row--) {
        if (newBoard[row][column] === null) {
          newBoard[row][column] = player;
          addedRow = row;
          break;
        }
      }

      if (addedRow !== -1) {
        const winningSequence = checkForAdjacentTokens(
          newBoard,
          addedRow,
          column,
          player
        );
        if (winningSequence) {
          setWinningTokens(winningSequence);
          setGameOver(true);
          if (player === 1) {
            setWinsYou(true);
          } else if (player === 2) {
            setWinsPlayerOne(true);
          }
          return;
        }
      }

      setGameBoard(newBoard);
      const isBoardFull = newBoard.every(row =>
        row.every(cell => cell !== null)
      );
      if (isBoardFull) {
        setDraw(true);
      }
    },
    [gameBoard, ROWS, checkForAdjacentTokens]
  );

  useEffect(() => {
    if (draw) {
      setGame(false);
    }
  }, [draw]);

  const getCurrentPlayer = () => {
    if (playerVsPlayer) {
      return playerOne ? 1 : 2;
    } else {
      return you ? 1 : 2;
    }
  };

  useEffect(() => {
    let timerId: NodeJS.Timeout | number;

    if (!isOpened && game && !draw) {
      timerId = setInterval(() => {
        setCounter(prevCounter => (prevCounter > 0 ? prevCounter - 1 : 0));
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isOpened, game, draw]);

  useEffect(() => {
    if (counter === 0 || gameOver) {
      if (playerVsPlayer) {
        setWinsPlayerOne(!playerOne);
        if (playerOne) {
          setPointsPlayerTwo(prevPoints => prevPoints + 1);
        } else {
          setPointsPlayerOne(prevPoints => prevPoints + 1);
        }
      } else {
        setWinsYou(!you);
        if (you) {
          setPointsCpu(prevPoints => prevPoints + 1);
        } else {
          setPointsYou(prevPoints => prevPoints + 1);
        }
      }
      setGame(false);
    }
  }, [counter, playerOne, you, playerVsPlayer, gameOver]);

  const computerMove = useCallback(() => {
    if (gameOver || draw) return;

    let bestColumn;

    const totalMoves = gameBoard.flat().filter(cell => cell !== null).length;
    if (totalMoves < 3) {
      bestColumn = pickBestMove(gameBoard, 2);
    } else {
      const depth = 5;
      [bestColumn] = minimax(gameBoard, depth, true, 1, 2);
    }

    if (bestColumn !== null) {
      addTokenToColumn(bestColumn, 2);
    }

    setYou(!you);
    resetCounter();
  }, [gameBoard, gameOver, draw, addTokenToColumn, you]);

  useEffect(() => {
    if (!playerVsPlayer && !you && !gameOver && !draw) {
      const timer = setTimeout(() => {
        computerMove();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [you, gameOver, draw, playerVsPlayer, computerMove]);

  const handleColumnClick = (columnIndex: number) => {
    if (!playerVsPlayer && !you) {
      return;
    }
    const currentPlayer = getCurrentPlayer();
    addTokenToColumn(columnIndex, currentPlayer);

    if (playerVsPlayer) {
      setPlayerOne(!playerOne);
    } else {
      setYou(!you);
    }
    resetCounter();
  };

  const resetCounter = () => {
    setCounter(30);
  };

  const toggleMenuGame = useCallback(() => {
    setIsOpened(!isOpened);
  }, [isOpened]);

  const handleMenuClick = () => {
    toggleMenuGame();
  };

  const handleMenuGameBackgroundClick = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    if (event.currentTarget === event.target) {
      toggleMenuGame();
    }
  };

  useEffect(() => {
    const handleEscapeKeyMenu = (event: KeyboardEvent) => {
      if (isOpened && event.key === 'Escape') {
        toggleMenuGame();
      }
    };
    if (isOpened) {
      document.addEventListener('keydown', handleEscapeKeyMenu);
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKeyMenu);
    };
  }, [isOpened, toggleMenuGame]);

  const handleRestartClick = () => {
    setPointsPlayerOne(0);
    setPointsPlayerTwo(0);
    setPointsYou(0);
    setPointsCpu(0);
    handlePlayAgainClick();
  };

  const handlePlayAgainClick = () => {
    setCounter(30);
    setGame(true);
    setWinsPlayerOne(false);
    setWinsYou(false);
    setGameBoard(initialBoard);
    setGameOver(false);
    setWinningTokens([]);
    setDraw(false);
  };

  const handleRestart = () => {
    toggleMenuGame();
    handleRestartClick();
  };

  const handleContinue = () => {
    toggleMenuGame();
  };

  const handleQuit = () => {
    handleRestart();
    navigate('/');
  };

  const handleMouseMove = (event: MouseEvent) => {
    const boardContainer = document.querySelector(
      `.${scss.game__boardContainer}`
    ) as HTMLElement;
    const containerRect = boardContainer.getBoundingClientRect();
    const containerStartX = containerRect.left;

    const columnWidth = containerRect.width / 7;
    const relativeMouseX = event.clientX - containerStartX;

    const columnIndex = Math.floor(relativeMouseX / columnWidth);
    const markerPosition = columnIndex * columnWidth + columnWidth / 2;
    setMarkerPosition(markerPosition);
  };

  useEffect(() => {
    const boardContainer = document.querySelector(
      `.${scss.game__boardContainer}`
    ) as HTMLElement;
    if (boardContainer && game) {
      boardContainer.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (boardContainer) {
        boardContainer.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [game]);

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1279 });
  const isDesktop = useMediaQuery({ minWidth: 1280 });

  let gameStyle = scss.game;
  let bottomBarStyle = scss.game__bottomBar;
  let boardStyle = scss.game__board;
  let turnStyle = scss.game__turn;
  let winsStyle = scss.game__wins;

  if (isMobile) {
    gameStyle += ` ${scss.gameMobile}`;
    bottomBarStyle += ` ${scss.gameMobile__bottomBar}`;
    boardStyle += ` ${scss.gameMobile__board}`;
    turnStyle += ` ${scss.gameMobile__turn}`;
    winsStyle += ` ${scss.gameMobile__wins}`;
  } else if (isTablet) {
    gameStyle += ` ${scss.gameTablet}`;
    bottomBarStyle += ` ${scss.gameTablet__bottomBar}`;
    boardStyle += ` ${scss.gameTablet__board}`;
    turnStyle += ` ${scss.gameTablet__turn}`;
    winsStyle += ` ${scss.gameTablet__wins}`;
  } else if (isDesktop) {
    gameStyle += ` ${scss.gameDesktop}`;
    bottomBarStyle += ` ${scss.gameDesktop__bottomBar}`;
    boardStyle += ` ${scss.gameDesktop__board}`;
    turnStyle += ` ${scss.gameDesktop__turn}`;
    winsStyle += ` ${scss.gameDesktop__wins}`;
  }

  const turnClasses = `${turnStyle} ${
    playerOne ? scss['game__turn-rose'] : scss['game__turn-yellow']
  }`;
  const cpuTurnClasses = you
    ? scss['game__turn-rose']
    : scss['game__turn-yellow'];

  const markerClasses = `${scss.game__marker} ${
    playerOne ? scss['game__marker-rose'] : scss['game__marker-yellow']
  }`;
  const cpuMarkerClasses = you
    ? scss['game__marker-rose']
    : scss['game__marker-yellow'];
  const bottomBarClasses = `${bottomBarStyle} ${
    !game
      ? winsPlayerOne || winsYou
        ? scss['game__bottomBar-rose']
        : scss['game__bottomBar-yellow']
      : ''
  }`;

  const backgroundMenuClasses = `${scss.backgroundMenu} ${
    !isOpened ? scss['is-hidden'] : ''
  }`;

  const getDynamicStyle = (finalTop: string) => {
    return {
      position: 'absolute',
      width: `${isMobile ? 41 : 70}px`,
      height: '100%',
      '--final-top': finalTop,
    };
  };

  return (
    <>
      <div className={gameStyle}>
        <GameHeader
          onClickMenu={handleMenuClick}
          onClickRestart={handleRestartClick}
        />
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
                className={`${markerClasses} ${cpuMarkerClasses}`}
                style={{
                  left: `${markerPosition}px`,
                  transition: 'all 0.3s ease-in-out',
                }}
              ></div>
            )}
            <div className={scss.game__boardBlack}>
              {(isDesktop || isTablet) && <BoardBlackLarge />}
              {isMobile && <BoardBlackSmall />}
            </div>
            <div className={scss.game__rc}>
              {gameBoard.map((row, rowIndex) => {
                const finalTopDesktop = `${17 + rowIndex * (70 + 18)}px`;
                const finalTopMobile = `${6 + rowIndex * (41 + 6)}px`;

                return (
                  <div
                    key={rowIndex}
                    className={scss.game__token}
                    style={{
                      position: 'absolute',
                      top: isMobile ? finalTopMobile : finalTopDesktop,
                      height: `${isMobile ? 41 : 70}px`,
                      width: '100%',
                    }}
                  >
                    {row.map((cell, colIndex) => {
                      const finalTop = isMobile
                        ? finalTopMobile
                        : finalTopDesktop;
                      const dynamicStyle = getDynamicStyle(finalTop);
                      const isWinningToken = winningTokens.some(
                        wt => wt.row === rowIndex && wt.col === colIndex
                      );

                      return (
                        <div
                          key={colIndex}
                          className={`${scss.game__token} ${
                            cell !== null ? scss.tokenDropAnimation : ''
                          }`}
                          style={{
                            ...dynamicStyle,
                            left: isMobile
                              ? `${6 + colIndex * (41 + 5.9)}px`
                              : `${17 + colIndex * (70 + 18)}px`,
                            position: 'absolute' as const,
                          }}
                          onClick={() => {
                            if (game) handleColumnClick(colIndex);
                          }}
                        >
                          {cell === 1 && (
                            <div className={scss.game__tokensContainer}>
                              {(isDesktop || isTablet) && (
                                <TokenRedLarge
                                  className={scss.game__tokenIcon}
                                />
                              )}
                              {isMobile && (
                                <TokenRedSmall
                                  className={scss.game__tokenIcon}
                                />
                              )}
                              {isWinningToken && (
                                <>
                                  {(isDesktop || isTablet) && (
                                    <div
                                      className={scss.game__tokenCircleDesktop}
                                    ></div>
                                  )}
                                  {isMobile && (
                                    <div
                                      className={scss.game__tokenCircleMobile}
                                    ></div>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                          {cell === 2 && (
                            <div className={scss.game__tokensContainer}>
                              {(isDesktop || isTablet) && (
                                <TokenYellowLarge
                                  className={scss.game__tokenIcon}
                                />
                              )}
                              {isMobile && (
                                <TokenYellowSmall
                                  className={scss.game__tokenIcon}
                                />
                              )}
                              {isWinningToken && (
                                <>
                                  {(isDesktop || isTablet) && (
                                    <div
                                      className={scss.game__tokenCircleDesktop}
                                    ></div>
                                  )}
                                  {isMobile && (
                                    <div
                                      className={scss.game__tokenCircleMobile}
                                    ></div>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className={scss.game__boardWhite}>
              {(isDesktop || isTablet) && <BoardWhiteLarge />}
              {isMobile && <BoardWhiteSmall />}
            </div>
          </div>
        </div>
        {game ? (
          <div className={`${turnClasses} ${cpuTurnClasses}`}>
            {playerVsPlayer ? (
              <p className={scss.game__turnText}>
                {playerOne ? 'PLAYER 1’S TURN' : 'PLAYER 2’S TURN'}
              </p>
            ) : (
              <p className={scss.game__turnText}>
                {you ? 'YOUR TURN' : 'CPU’S TURN'}
              </p>
            )}
            <p className={scss.game__turnCounter}>{counter}s</p>
          </div>
        ) : (
          <div className={winsStyle}>
            {playerVsPlayer ? (
              <p className={scss.game__winsPlayer}>
                {draw ? 'NO WINNER' : winsPlayerOne ? 'PLAYER 1' : 'PLAYER 2'}
              </p>
            ) : (
              <p className={scss.game__winsPlayer}>
                {draw ? 'NO WINNER' : winsYou ? 'YOU' : 'CPU'}
              </p>
            )}
            <p className={scss.game__winsWins}>{draw ? 'DRAW' : 'WINS'}</p>
            <button
              type="button"
              className={scss.game__winsButton}
              onClick={handlePlayAgainClick}
            >
              PLAY AGAIN
            </button>
          </div>
        )}
        <div className={bottomBarClasses}></div>
      </div>
      <div
        className={backgroundMenuClasses}
        onClick={handleMenuGameBackgroundClick}
      >
        <ModalMenuGame
          onClickRestart={handleRestart}
          onClickContinue={handleContinue}
          onClickQuit={handleQuit}
        />
      </div>
    </>
  );
};
