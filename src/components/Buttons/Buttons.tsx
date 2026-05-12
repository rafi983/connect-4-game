import { ReactElement } from 'react';
import scss from './Buttons.module.scss';

type ButtonsProps = {
  text: string;
  icon?: ReactElement;
  classes?: string;
  onClick: () => void;
};

export const Buttons: React.FC<ButtonsProps> = ({
  text,
  icon,
  classes,
  onClick,
}) => {
  const className = [scss.button, classes].filter(Boolean).join(' ');

  return (
    <button type="button" className={className} onClick={onClick}>
      <span>{text}</span>
      {icon ? <span>{icon}</span> : null}
    </button>
  );
};
