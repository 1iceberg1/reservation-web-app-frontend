import { DialogProps } from '@mui/material/Dialog';

import { IConsumptionItem } from 'src/types/consumption';

// ----------------------------------------------------------------------

export type ConfirmDialogProps = Omit<DialogProps, 'title' | 'content'> & {
  title: React.ReactNode;
  content?: React.ReactNode;
  action: React.ReactNode;
  onClose: VoidFunction;
};

export type ConsumptionDialogProps = Omit<DialogProps, 'title' | 'content'> & {
  onClose: () => void;
  handleClick: (consumptionId: string, quantity: number) => Promise<void>;
  consumptions: IConsumptionItem[];
};
