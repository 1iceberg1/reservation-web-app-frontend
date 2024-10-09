import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

const EyeSwtich = styled(Switch)(({ theme }) => ({
  width: 100,
  height: 56,
  padding: 12,
  '& .MuiSwitch-switchBase': {
    margin: 0,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(40px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('/assets/icons/eye-enabled.svg')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#fff',
    width: 52,
    height: 52,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('/assets/icons/eye-disabled.svg')`,
      borderRadius: '50%',
    },
  },
  '& .MuiSwitch-track': {
    opacity: 0.5,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20,
  },
}));

export default EyeSwtich;
