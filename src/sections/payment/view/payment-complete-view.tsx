'use client';

import { useState, useEffect } from 'react';

import { useTheme } from '@mui/material/styles';
import { Stack, Button, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useSettingsContext } from 'src/components/settings';

export function PaymentCompleteView() {
  const settings = useSettingsContext();
  const theme = useTheme();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [paymentStatus, setPaymentStatus] = useState(false);

  useEffect(() => {
    const redirectStatus = searchParams.get('redirect_status');

    if (redirectStatus === 'succeeded') {
      setPaymentStatus(true);
    }
  }, [searchParams]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Stack rowGap={2}>
        {paymentStatus ?
          <Typography
            color={theme.palette.success.main}
            variant="h4"
            textAlign="center"
          >
            Payment Successful
          </Typography>
        : <Typography
            color={theme.palette.error.main}
            variant="h4"
            textAlign="center"
          >
            Payment Failed
          </Typography>
        }
        <Button
          variant="contained"
          onClick={() => {
            router.push(paths.guest.reservation.root);
          }}
        >
          Go to Reservation List
        </Button>
      </Stack>
    </Container>
  );
}
