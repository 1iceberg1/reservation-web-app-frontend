import { StackProps } from '@mui/material/Stack';

// ----------------------------------------------------------------------

export type CustomStepperProps = Omit<StackProps, 'activeStep' & 'steps'> & {
  activeStep: number;
  steps: string[];
};
