import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

type Props = {
  image?: string;
  children: React.ReactNode;
};

export default function AuthLayout({ children, image }: Props) {
  // const mdUp = useResponsive('up', 'md');

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: { xs: 480, md: 640 },
        px: { xs: 2, md: 8 },
      }}
    >
      <Box display="flex" justifyContent="center">
        <Logo
          sx={{
            mt: { xs: 4, md: 8 },
            mb: { xs: 4, md: 8 },
            width: { xs: '70%', md: '60%' },
          }}
        />
      </Box>

      <Card
        sx={{
          py: { xs: 5 },
          px: { xs: 3 },
        }}
      >
        {children}
      </Card>
    </Stack>
  );

  // const renderSection = (
  //   <Stack flexGrow={1} sx={{ position: 'relative' }}>
  //     <Box
  //       component="img"
  //       alt="auth"
  //       src={image || '/assets/background/overlay.jpg'}
  //       sx={{
  //         top: 16,
  //         left: 16,
  //         objectFit: 'contain',
  //         position: 'absolute',
  //         width: 'calc(100% - 32px)',
  //         height: 'calc(100% - 32px)',
  //       }}
  //     />
  //   </Stack>
  // );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
        position: 'relative',
        '&:before': {
          width: 1,
          height: 1,
          zIndex: -1,
          content: "''",
          position: 'absolute',
          backgroundSize: 'cover',
          opacity: { xs: 0.24 },
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundImage: 'url(/assets/background/overlay.jpg)',
        },
      }}
    >
      {renderContent}

      {/* {mdUp && renderSection} */}
    </Stack>
  );
}
