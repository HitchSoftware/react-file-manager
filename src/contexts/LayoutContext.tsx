// REPO: @hitchsoftware/react-file-manager
// FILE: src/contexts/LayoutContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type LayoutType = "list" | "grid";

interface LayoutContextValue {
  activeLayout: LayoutType;
  setActiveLayout: Dispatch<SetStateAction<LayoutType>>;
}

interface LayoutProviderProps {
  children: ReactNode;
  layout: string;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export const LayoutProvider: React.FC<LayoutProviderProps> = ({
  children,
  layout,
}) => {
  const [activeLayout, setActiveLayout] = useState<LayoutType>(() =>
    validateLayout(layout)
  );

  function validateLayout(layout: string): LayoutType {
    return layout === "list" || layout === "grid" ? layout : "grid";
  }

  return (
    <LayoutContext.Provider value={{ activeLayout, setActiveLayout }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextValue => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
};
