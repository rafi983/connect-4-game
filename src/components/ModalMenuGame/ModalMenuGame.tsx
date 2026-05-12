import { useMediaQuery } from 'react-responsive';
import { Buttons } from '../Buttons/Buttons';
import scss from './ModalMenuGame.module.scss';

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
  const isDesktop = useMediaQuery({ minWidth: 1280 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1279 });

  const prefix = isDesktop ? 'Desktop' : isTablet ? 'Tablet' : 'Mobile';
  const modalMenuGameStyle = `${scss.modalMenuGame} ${scss[`modalMenuGame${prefix}`]}`;
  const pauseStyle = `${scss.modalMenuGame__pause} ${scss[`modalMenuGame${prefix}__pause`]}`;

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
