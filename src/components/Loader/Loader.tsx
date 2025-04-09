// REPO: @hitchsoftware/react-file-manager
// FILE: src/components/Loader/Loader.tsx

import React from "react";
import { ImSpinner2 } from "react-icons/im";
import "./Loader.scss";

interface LoaderProps {
  loading?: boolean;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ loading = false, className = "" }) => {
  if (!loading) return null;

  return (
    <div className={`loader-container ${className}`}>
      <ImSpinner2 className="spinner" />
    </div>
  );
};

export default Loader;
