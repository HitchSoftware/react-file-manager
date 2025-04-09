// src/types/ContextMenuItem.ts

export interface ContextMenuItem {
    title: string;
    icon?: React.ReactNode;
    className?: string;
    onClick?: () => void;
    selected?: boolean;
    children?: ContextMenuItem[];
    divider?: boolean;
    hidden?: boolean;
  }
  