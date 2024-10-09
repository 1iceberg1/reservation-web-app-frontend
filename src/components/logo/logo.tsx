import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import CardMedia from '@mui/material/CardMedia';
import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const settings = useSettingsContext();

    return (
      <Link component={RouterLink} href="/" width={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box
          ref={ref}
          component="div"
          sx={{
            width: '80%',
            display: 'inline-flex',
            ...sx,
          }}
          {...other}
        >
          <CardMedia
            src={
              settings.themeMode === 'light' ?
                resources.brand.light
              : resources.brand.dark
            }
            component="img"
          />
        </Box>
      </Link>
    );
  }
);

const resources = {
  brand: {
    light: '/logo/logo_light.png',
    dark: '/logo/logo_dark.png',
  },
};

export default Logo;
