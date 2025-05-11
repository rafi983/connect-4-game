import React, { ReactElement } from 'react';
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
  return (
    <>
      <button className={`${scss.button} ${classes}`} onClick={onClick}>
        <span>{text} </span>
        <span>{icon}</span>
      </button>
    </>
  );
};
