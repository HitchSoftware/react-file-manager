// REPO: @hitchsoftware/react-file-manager
// FILE: src/hooks/useTriggerAction.ts

import { useState } from "react";
import { TriggerAction } from "../types/TriggerAction";

export const useTriggerAction = (): TriggerAction => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string | null>(null);

  const show = (type: string) => {
    setIsActive(true);
    setActionType(type);
  };

  const close = () => {
    setIsActive(false);
    setActionType(null);
  };

  return {
    isActive,
    actionType,
    show,
    close,
  };
};
