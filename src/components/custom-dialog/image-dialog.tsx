import { Stack, IconButton } from '@mui/material';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

export function ImageDialog({ open, handleClose, imageSrc }) {
  if (!open) return null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={12}
      sx={{
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 6,
        position: 'fixed',
        bgcolor: '#000000',
        opacity: 0.99,
      }}
    >
      <IconButton
        color="primary"
        sx={{
          top: 20,
          right: 30,
          position: 'absolute',
        }}
        onClick={handleClose}
      >
        <Iconify icon="material-symbols:cancel" width={32} height={32} />
      </IconButton>
      <Image src={imageSrc} alt='Image Dialog' height="70vh" minHeight={350} />
    </Stack>
  );
}
