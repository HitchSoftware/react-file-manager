// REPO: @hitchsoftware/react-file-manager
// FILE: src/components/Collapse/Collapse.tsx

import React, { useState, useEffect, ReactNode } from "react";
import { useCollapse } from "react-collapsed";

export interface CollapseProps {
  open: boolean;
  children?: ReactNode;
}

const Collapse: React.FC<CollapseProps> = ({ open, children }) => {
  const [isExpanded, setExpanded] = useState(open);
  const { getCollapseProps } = useCollapse({
    isExpanded,
    duration: 500,
  });

  useEffect(() => {
    setExpanded(open);
  }, [open]);

  return <div {...getCollapseProps()}>{children}</div>;
};

export default Collapse;
