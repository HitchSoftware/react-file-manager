// REPO: @hitchsoftware/react-file-manager
// FILE: src/components/Button/Button.tsx

import React, { ReactNode } from "react";
import "./Button.scss";

export interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  type?: "primary" | "secondary" | string;
  padding?: string;
  children?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  onKeyDown,
  type = "primary",
  padding = "0.4rem 0.8rem",
  children,
}) => {
  return (
    <button
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`fm-button fm-button-${type}`}
      style={{ padding }}
    >
      {children}
    </button>
  );
};

export default Button;
