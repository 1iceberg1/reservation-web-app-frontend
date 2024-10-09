import * as React from 'react';

import { styled } from '@mui/material/styles';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';

export const CustomAccordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters square {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  '&.Mui-expanded': {
    boxShadow: 'none',
  },
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

export const CustomAccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary {...props} />
))(({ theme }) => ({
  minHeight: 0,
  padding: 0,
  marginLeft: theme.spacing(2.5),
  marginRight: theme.spacing(2.5),
  backgroundColor: theme.palette.primary.main,
  '& .MuiAccordionSummary-content': {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    justifyContent: 'center',
    color: 'white',
    fontWeight: 600,
    fontSize: 14,
  },
}));

export const CustomAccordionDetails = styled(MuiAccordionDetails)(
  ({ theme }) => ({
    padding: theme.spacing(1),
    border: 'none',
    color: '#000',
  })
);
