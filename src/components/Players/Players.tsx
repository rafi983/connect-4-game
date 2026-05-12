import { useContext } from 'react';
import { useMediaQuery } from 'react-responsive';
import { ReactComponent as Cpu } from '../../assets/images/cpu.svg';
import { ReactComponent as PlayerOne } from '../../assets/images/player-one.svg';
import { ReactComponent as PlayerTwo } from '../../assets/images/player-two.svg';
import { ReactComponent as You } from '../../assets/images/you.svg';
import { GameContext } from '../App';
import scss from './Players.module.scss';

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

  const isDesktop = useMediaQuery({ minWidth: 1280 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1279 });

  const prefix = isDesktop ? 'Desktop' : isTablet ? 'Tablet' : 'Mobile';
  const playersStyles = `${scss.players} ${scss[`players${prefix}`]}`;
  const playerStyles = `${scss.players__player} ${scss[`players${prefix}__player`]}`;
  const playerNameStyle = `${scss.players__playerName} ${scss[`players${prefix}__playerName`]}`;
  const playerScoreStyle = `${scss.players__playerScore} ${scss[`players${prefix}__playerScore`]}`;
  const playerOneStyle = `${scss.players__playerOne} ${scss[`players${prefix}__playerOne`]}`;
  const playerTwoStyle = `${scss.players__playerTwo} ${scss[`players${prefix}__playerTwo`]}`;

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
