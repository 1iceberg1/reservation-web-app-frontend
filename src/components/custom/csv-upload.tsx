import * as React from 'react';

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import Iconify from 'src/components/iconify/iconify';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function CSVUploadButton({ onUpload }) {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<Iconify icon="mingcute:add-line" />}
    >
      Importar
      <VisuallyHiddenInput type="file" accept=".csv" onChange={onUpload} />
    </Button>
  );
}
