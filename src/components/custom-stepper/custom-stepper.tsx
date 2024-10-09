import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';
import Check from '@mui/icons-material/Check';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import { StepIconProps } from '@mui/material/StepIcon';
import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector';

import { CustomStepperProps } from './types';

const QueryConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.palette.primary.main,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QueryStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: theme.palette.primary.main,
    }),
    '& .QueryStepIcon-completedIcon': {
      color: theme.palette.primary.main,
      zIndex: 1,
      fontSize: 18,
    },
    '& .QueryStepIcon-circle': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    },
  })
);

function QueryStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QueryStepIconRoot ownerState={{ active }} className={className}>
      {completed ?
        <Check className="QueryStepIcon-completedIcon" />
      : <div className="QueryStepIcon-circle" />}
    </QueryStepIconRoot>
  );
}

export default function CustomStepper({
  activeStep,
  steps,
  children,
  ...others
}: CustomStepperProps) {
  return (
    <Stack sx={{ width: '100%' }} spacing={6} {...others}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<QueryConnector />}
      >
        {steps.map(label => (
          <Step key={label}>
            <StepLabel StepIconComponent={QueryStepIcon}>
              <Typography>{label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      {children}
    </Stack>
  );
}
