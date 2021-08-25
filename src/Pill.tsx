import React from 'react';
import { buttonStyle, pillStyle, pillWithHeaderStyle } from './pill.css';

interface PillProps {
  header: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Pill(props: PillProps) {
  const className = `pill ${pillStyle} ${
    props.header ? pillWithHeaderStyle : ''
  }`;
  return (
    <div className={className}>
      <button type="button" className={buttonStyle} onClick={props.onClick}>
        {props.children}
      </button>
    </div>
  );
}
