import React from 'react';
import scss from './GameHeader.module.scss';
import { useMediaQuery } from 'react-responsive';
import { ReactComponent as Logo } from '../../assets/images/logo.svg';

type GameHeaderProps = {
  onClickMenu: () => void;
  onClickRestart: () => void;
};

export const GameHeader: React.FC<GameHeaderProps> = ({
  onClickMenu,
  onClickRestart,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1279 });
  const isDesktop = useMediaQuery({ minWidth: 1280 });

  let gameHeaderStyle = scss.gameHeader;

  if (isMobile) {
    gameHeaderStyle += ` ${scss.gameHeaderMobile}`;
  } else if (isTablet) {
    gameHeaderStyle += ` ${scss.gameHeaderTablet}`;
  } else if (isDesktop) {
    gameHeaderStyle += ` ${scss.gameHeaderDesktop}`;
  }

  return (
    <div className={gameHeaderStyle}>
      <button
        type="button"
        className={scss.gameHeader__button}
        onClick={onClickMenu}
      >
        MENU
      </button>
      <div className={scss.gameHeader__logo}>
        <Logo />
      </div>
      <button
        type="button"
        className={scss.gameHeader__button}
        onClick={onClickRestart}
      >
        RESTART
      </button>
    </div>
  );
};
