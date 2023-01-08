import { useState, useEffect } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Box, Button, Container } from '@chakra-ui/react';

const stripePromise = loadStripe('pk_test_51MLMB4Iojr912iY5E3Zoy28Lr8HCl9wPlHoBOfa1Qyf1AbQqIv0xc2QFgHrVk4hEpOUBnrCBJnyNC6bemvd7ZAYn005BlMRmLU');

const Payment = (props: any) => {
  const [clientSecret, setClientSecret] = useState();

  const callStripeClientSecret = async () => {
    const res: any = await axios.post('/api/stripe/payment-intent', {
      amount: 30,
    });

    const { client_secret } = res.data;

    setClientSecret(client_secret);
  };

  useEffect(() => {
    callStripeClientSecret();
  }, []);

  return (
    <>
      {clientSecret && (
        <>
          <Box as="div" borderRadius={'10px'} boxShadow={'var(--box-shadow)'} pt={'1.3rem'} pb={'2rem'} px={'2rem'}>
            <Box as="h1" fontWeight="bold" fontSize={'1.3rem'} mb={'0.5rem'}>
              Payment Details
            </Box>
            <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
              <form>
                <PaymentElement />
                <Button colorScheme={'brand'} mt={'1rem'} w={'100%'}>
                  Pay Now
                </Button>
              </form>
            </Elements>
          </Box>
        </>
      )}
    </>
  );
};

export default Payment;
