import { Theme } from '@mui/material/styles';
import { accordionClasses } from '@mui/material/Accordion';
import { typographyClasses } from '@mui/material/Typography';
import { accordionSummaryClasses } from '@mui/material/AccordionSummary';

// ----------------------------------------------------------------------

export function accordion(theme: Theme) {
  return {
    MuiAccordion: {
      styleOverrides: {
        root: {
          [`&.${accordionClasses.expanded}`]: {
            boxShadow: theme.customShadows.z8,
            borderRadius: theme.shape.borderRadius,
            backgroundColor: 'transparent',
          },
          [`&.${accordionClasses.disabled}`]: {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          boxShadow: theme.customShadows.z4,
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(1),
          backgroundColor: theme.palette.background.paper,
          [`&.${accordionSummaryClasses.disabled}`]: {
            opacity: 1,
            color: theme.palette.action.disabled,
            [`& .${typographyClasses.root}`]: {
              color: 'inherit',
            },
          },
        },
        expandIconWrapper: {
          color: theme.palette.primary.main,
        },
      },
    },
  };
}
