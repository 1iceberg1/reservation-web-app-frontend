'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useMemo, useState, useEffect } from 'react';

import { useTheme } from '@mui/material/styles';
import { Stack, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { STRIPE_PUBLISH_KEY } from 'src/config-global';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import EmptyContent from 'src/components/empty-content/empty-content';

import { PaymentForm } from 'src/sections/payment/payment-form';

type Apperance = {
  theme?: 'night' | 'flat' | 'stripe';
};

export function PaymentView() {
  const settings = useSettingsContext();
  const theme = useTheme();

  const stripePromise = loadStripe(STRIPE_PUBLISH_KEY ?? '');
  const [clientSecret, setClientSecret] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const appearance: Apperance = {
    theme: theme.palette.mode === 'light' ? 'flat' : 'night',
  };

  const getPayment = () => {
    axios.get(endpoints.payment.latest).then(paymentResponse => {
      if (paymentResponse.data?.status) {
        if (paymentResponse.data?.client_secret) {
          setClientSecret(paymentResponse.data.client_secret);
        }
      } else if (paymentResponse.data.message) {
        setStatusMessage(paymentResponse.data.message);
      }
    });
  };

  const isValid = useMemo(() => {
    if (STRIPE_PUBLISH_KEY && clientSecret) return true;
    return false;
  }, [clientSecret]);

  useEffect(() => {
    if (!isValid) getPayment();
  }, [isValid]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Checkout"
        links={[
          { name: 'Painel', href: paths.admin.root },
          { name: 'Checkout' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {isValid ?
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance,
          }}
        >
          <PaymentForm />
        </Elements>
      : <Stack>
          <EmptyContent />
          <Typography textAlign="center">{statusMessage}</Typography>
        </Stack>
      }
    </Container>
  );
}
