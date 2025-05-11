import scss from './ModalMenuGame.module.scss';
import { useMediaQuery } from 'react-responsive';
import { Buttons } from '../Buttons/Buttons';

type ModalMenuGameProps = {
  onClickContinue: () => void;
  onClickRestart: () => void;
  onClickQuit: () => void;
};

export const ModalMenuGame: React.FC<ModalMenuGameProps> = ({
  onClickContinue,
  onClickRestart,
  onClickQuit,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1279 });
  const isDesktop = useMediaQuery({ minWidth: 1280 });

  let modalMenuGameStyle = scss.modalMenuGame;
  let pauseStyle = scss.modalMenuGame__pause;

  if (isMobile) {
    modalMenuGameStyle += ` ${scss.modalMenuGameMobile}`;
    pauseStyle += ` ${scss.modalMenuGameMobile__pause}`;
  } else if (isTablet) {
    modalMenuGameStyle += ` ${scss.modalMenuGameTablet}`;
    pauseStyle += ` ${scss.modalMenuGameTablet__pause}`;
  } else if (isDesktop) {
    modalMenuGameStyle += ` ${scss.modalMenuGameDesktop}`;
    pauseStyle += ` ${scss.modalMenuGameDesktop__pause}`;
  }

  return (
    <div className={modalMenuGameStyle}>
      <h4 className={pauseStyle}>Menu</h4>
      <div className={scss.modalMenuGame__buttons}>
        <Buttons
          text="CONTINUE GAME"
          onClick={onClickContinue}
          classes={scss.modalMenuGame__btnWhite}
        />
        <Buttons
          text="RESTART"
          onClick={onClickRestart}
          classes={scss.modalMenuGame__btnWhite}
        />
        <Buttons
          text="QUIT GAME"
          onClick={onClickQuit}
          classes={scss.modalMenuGame__btnRose}
        />
      </div>
    </div>
  );
};
