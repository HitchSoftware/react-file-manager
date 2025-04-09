export type TriggerAction = {
  isActive: boolean;
  actionType: string | null;
  show: (type: string) => void;
  close: () => void;
};
