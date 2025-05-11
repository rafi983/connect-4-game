import { useContext } from 'react';
import scss from './Players.module.scss';
import { useMediaQuery } from 'react-responsive';
import { ReactComponent as PlayerOne } from '../../assets/images/player-one.svg';
import { ReactComponent as PlayerTwo } from '../../assets/images/player-two.svg';
import { ReactComponent as You } from '../../assets/images/you.svg';
import { ReactComponent as Cpu } from '../../assets/images/cpu.svg';
import { GameContext } from '../App';

interface PlayersProps {
  pointsPlayerOne: number;
  pointsPlayerTwo: number;
  pointsYou: number;
  pointsCpu: number;
}

export const Players: React.FC<PlayersProps> = ({
  pointsPlayerOne,
  pointsPlayerTwo,
  pointsYou,
  pointsCpu,
}) => {
  const { playerVsPlayer } = useContext(GameContext);

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1279 });
  const isDesktop = useMediaQuery({ minWidth: 1280 });

  let playersStyles = scss.players;
  let playerStyles = scss.players__player;
  let playerNameStyle = scss.players__playerName;
  let playerScoreStyle = scss.players__playerScore;
  let playerOneStyle = scss.players__playerOne;
  let playerTwoStyle = scss.players__playerTwo;

  if (isMobile) {
    playersStyles += ` ${scss.playersMobile}`;
    playerStyles += ` ${scss.playersMobile__player}`;
    playerNameStyle += ` ${scss.playersMobile__playerName}`;
    playerScoreStyle += ` ${scss.playersMobile__playerScore}`;
    playerOneStyle += ` ${scss.playersMobile__playerOne}`;
    playerTwoStyle += ` ${scss.playersMobile__playerTwo}`;
  } else if (isTablet) {
    playersStyles += ` ${scss.playersTablet}`;
    playerStyles += ` ${scss.playersTablet__player}`;
    playerNameStyle += ` ${scss.playersTablet__playerName}`;
    playerScoreStyle += ` ${scss.playersTablet__playerScore}`;
    playerOneStyle += ` ${scss.playersTablet__playerOne}`;
    playerTwoStyle += ` ${scss.playersTablet__playerTwo}`;
  } else if (isDesktop) {
    playersStyles += ` ${scss.playersDesktop}`;
    playerStyles += ` ${scss.playersDesktop__player}`;
    playerNameStyle += ` ${scss.playersDesktop__playerName}`;
    playerScoreStyle += ` ${scss.playersDesktop__playerScore}`;
    playerOneStyle += ` ${scss.playersDesktop__playerOne}`;
    playerTwoStyle += ` ${scss.playersDesktop__playerTwo}`;
  }

  return (
    <div className={playersStyles}>
      <div className={playerStyles}>
        <div className={playerNameStyle}>
          {playerVsPlayer ? 'PLAYER 1' : 'YOU'}
        </div>
        <div className={playerScoreStyle}>
          {playerVsPlayer ? pointsPlayerOne : pointsYou}
        </div>
        <div className={playerOneStyle}>
          {playerVsPlayer ? <PlayerOne /> : <You />}
        </div>
      </div>
      <div className={playerStyles}>
        <div className={playerNameStyle}>
          {playerVsPlayer ? 'PLAYER 2' : 'CPU'}
        </div>
        <div className={playerScoreStyle}>
          {playerVsPlayer ? pointsPlayerTwo : pointsCpu}
        </div>
        <div className={playerTwoStyle}>
          {playerVsPlayer ? <PlayerTwo /> : <Cpu />}
        </div>
      </div>
    </div>
  );
};
