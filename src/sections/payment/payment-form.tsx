import {
  useStripe,
  useElements,
  PaymentElement
} from '@stripe/react-stripe-js';

import { Box } from '@mui/system';
import { Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { APP_URL } from 'src/config-global';

export function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  // Define the custom styles for the Stripe PaymentElement

  const handleSubmit = async event => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${APP_URL}${paths.guest.payment.complete}`
      }
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ color: 'white' }}>
        <PaymentElement />
      </Box>
      <Box width="100%" mt={3}>
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          disabled={!stripe}
          sx={{ width: '100%' }}
        >
          Submit
        </Button>
      </Box>
    </form>
  );
}
