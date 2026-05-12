import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import scss from './GameHeader.module.scss';

type GameHeaderProps = {
  onClickMenu: () => void;
  onClickRestart: () => void;
};

export const GameHeader: React.FC<GameHeaderProps> = ({
  onClickMenu,
  onClickRestart,
}) => {
  const isDesktop = useMediaQuery({ minWidth: 1280 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1279 });

  const gameHeaderStyle = [
    scss.gameHeader,
    isDesktop ? scss.gameHeaderDesktop : '',
    !isDesktop && isTablet ? scss.gameHeaderTablet : '',
    !isDesktop && !isTablet ? scss.gameHeaderMobile : '',
  ]
    .filter(Boolean)
    .join(' ');

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
