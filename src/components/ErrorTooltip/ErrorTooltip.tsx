// REPO: @hitchsoftware/react-file-manager
// FILE: src/components/ErrorTooltip/ErrorTooltip.tsx

import React from "react";
import "./ErrorTooltip.scss";

interface ErrorTooltipProps {
  message: string;
  xPlacement?: string;
  yPlacement?: string;
}

const ErrorTooltip: React.FC<ErrorTooltipProps> = ({ message, xPlacement = "", yPlacement = "" }) => {
  return <p className={`error-tooltip ${xPlacement} ${yPlacement}`}>{message}</p>;
};

export default ErrorTooltip;
