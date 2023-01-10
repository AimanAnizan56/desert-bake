import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { Box, Button } from '@chakra-ui/react';
import { useState } from 'react';

const stripePromise = loadStripe('pk_test_51MLMB4Iojr912iY5E3Zoy28Lr8HCl9wPlHoBOfa1Qyf1AbQqIv0xc2QFgHrVk4hEpOUBnrCBJnyNC6bemvd7ZAYn005BlMRmLU');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [buttonState, setButtonState] = useState({
    isLoading: false,
  });

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log('handlesubmit');

    if (elements == null) {
      return;
    }

    try {
      setButtonState({
        ...buttonState,
        isLoading: true,
      });

      const stripeRes = await stripe?.confirmPayment({
        elements,
        confirmParams: {
          // todo -- improvise later / ignore if there if success page
          return_url: `${process.env.NEXT_PUBLIC_HOST_TEST}/`,
        },
        redirect: 'if_required',
      });

      if (stripeRes?.error) {
        // todo - add modal to display error
        console.log('inform that there was an error');
        console.log(stripeRes?.error);
        setButtonState({
          ...buttonState,
          isLoading: false,
        });
        return;
      }

      console.log('====================================');
      console.log('Response stripe');
      console.log(stripeRes);
      console.log('====================================');

      if (stripeRes?.paymentIntent.status == 'succeeded') {
        // todo - redirect to success page
        console.log('succeed');
        setButtonState({
          ...buttonState,
          isLoading: false,
        });
      }
    } catch (err) {
      console.log('====================================');
      console.log('stripe confirm payment error');
      console.log(err);
      console.log('====================================');
    }
  };

  return (
    <form>
      <PaymentElement />
      <Button onClick={handleSubmit} colorScheme={'brand'} mt={'1rem'} w={'100%'} disabled={!stripe} isLoading={buttonState.isLoading}>
        Pay Now
      </Button>
    </form>
  );
};

const Payment = ({ clientSecret }: any) => {
  return (
    <>
      {clientSecret && (
        <>
          <Box as="div" borderRadius={'10px'} boxShadow={'var(--box-shadow)'} pt={'1.3rem'} pb={'2rem'} px={'2rem'}>
            <Box as="h1" fontWeight="bold" fontSize={'1.3rem'} mb={'0.5rem'}>
              Payment Details
            </Box>
            <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
              <CheckoutForm />
            </Elements>
          </Box>
        </>
      )}
    </>
  );
};

export default Payment;
