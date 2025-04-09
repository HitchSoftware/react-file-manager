// REPO: @hitchsoftware/react-file-manager
// FILE: src/components/NameInput/NameInput.tsx

import React from "react";
import "./NameInput.scss";

interface NameInputProps {
  nameInputRef: React.RefObject<HTMLTextAreaElement>;
  maxLength?: number;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  onClick?: React.MouseEventHandler<HTMLTextAreaElement>;
  rows?: number;
}

const NameInput: React.FC<NameInputProps> = ({
  nameInputRef,
  maxLength,
  value,
  onChange,
  onKeyDown,
  onClick,
  rows,
}) => {
  return (
    <textarea
      ref={nameInputRef}
      className="rename-file"
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onClick={onClick}
      rows={rows}
    />
  );
};

export default NameInput;
