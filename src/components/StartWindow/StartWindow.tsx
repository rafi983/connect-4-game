import { useState, useContext } from 'react';
import scss from './StartWindow.module.scss';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Buttons } from '../Buttons/Buttons';
import { ReactComponent as PlayerVsCpu } from '../../assets/images/player-vs-cpu.svg';
import { ReactComponent as PlayerVsPlayer } from '../../assets/images/player-vs-player.svg';
import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import { ReactComponent as IconCheck } from '../../assets/images/icon-check.svg';
import { ReactComponent as IconCheckHover } from '../../assets/images/icon-check-hover.svg';
import { GameContext } from '../App';

export const StartWindow = () => {
  const [isOpened, setIsOpened] = useState(false);
  const navigate = useNavigate();
  const { setPlayerVsPlayer } = useContext(GameContext);

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTabletDesktop = useMediaQuery({ minWidth: 769 });

  let startWindowStyles = scss.startWindow;
  let gameRulesWindowStyles = scss.gameRulesWindow;
  let gameRulesContainerStyles = scss.gameRulesContainer;

  if (isMobile) {
    startWindowStyles += ` ${scss.startWindowMobile}`;
    gameRulesWindowStyles += ` ${scss.gameRulesWindowMobile}`;
    gameRulesContainerStyles += ` ${scss.gameRulesContainerMobile}`;
  } else if (isTabletDesktop) {
    startWindowStyles += ` ${scss.startWindowTabletDesktop}`;
    gameRulesWindowStyles += ` ${scss.gameRulesWindowTabletDesktop}`;
    gameRulesContainerStyles += ` ${scss.gameRulesContainerTabletDesktop}`;
  }

  const gameRulesContainerClasses = `${gameRulesContainerStyles} ${
    !isOpened ? scss['rulesHidden'] : ''
  }`;

  const handleGameRulesToggle = () => {
    setIsOpened(!isOpened);
  };

  const handlePlayVsPlayer = () => {
    setPlayerVsPlayer(true);
    navigate('/game');
  };

  const handlePlayVsCpu = () => {
    setPlayerVsPlayer(false);
    navigate('/game');
  };

  return (
    <>
      <div className={startWindowStyles}>
        <div>
          <Logo />
        </div>
        <div className={scss.startWindow__buttons}>
          <Buttons
            text="PLAY VS CPU"
            icon={<PlayerVsCpu />}
            classes={scss.startWindow__vsCpu}
            onClick={handlePlayVsCpu}
          />
          <Buttons
            text="PLAY VS PLAYER"
            icon={<PlayerVsPlayer />}
            classes={scss.startWindow__vsPlayer}
            onClick={handlePlayVsPlayer}
          />
          <Buttons text="GAME RULES" onClick={handleGameRulesToggle} />
        </div>
      </div>
      <div className={gameRulesContainerClasses}>
        <div className={gameRulesWindowStyles}>
          <h2 className={scss.gameRulesWindow__title}>RULES</h2>
          <h4 className={scss.gameRulesWindow__titleText}>OBJECTIVE</h4>
          <p className={scss.gameRulesWindow__text}>
            Be the first player to connect 4 of the same colored discs in a row
            (either vertically, horizontally, or diagonally).
          </p>
          <h4 className={scss.gameRulesWindow__titleText}>HOW TO PLAY</h4>
          <ul className={scss.gameRulesWindow__textRules}>
            <li className={scss.gameRulesWindow__textRulesItem1}>
              <span className={scss.gameRulesWindow__textRulesCount}>1</span>
              <span>Red goes first in the first game.</span>
            </li>
            <li className={scss.gameRulesWindow__textRulesItem2and3}>
              <span className={scss.gameRulesWindow__textRulesCount}>2</span>
              <span>
                Players must alternate turns, and only one disc can be dropped
                in each turn.
              </span>
            </li>
            <li className={scss.gameRulesWindow__textRulesItem2and3}>
              <span className={scss.gameRulesWindow__textRulesCount}>3</span>
              <span>
                The game ends when there is a 4-in-a-row or a stalemate.
              </span>
            </li>
            <li className={scss.gameRulesWindow__textRulesItem4}>
              <span className={scss.gameRulesWindow__textRulesCount}>4</span>
              <span>
                The starter of the previous game goes second on the next game.
              </span>
            </li>
          </ul>
          <button
            className={scss.gameRulesWindow__btnCheck}
            onClick={handleGameRulesToggle}
          >
            <IconCheck className={scss.gameRulesWindow__iconCheck} />
            <IconCheckHover className={scss.gameRulesWindow__iconCheckHover} />
          </button>
        </div>
      </div>
    </>
  );
};
