import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { Box, Button } from '@chakra-ui/react';

const stripePromise = loadStripe('pk_test_51MLMB4Iojr912iY5E3Zoy28Lr8HCl9wPlHoBOfa1Qyf1AbQqIv0xc2QFgHrVk4hEpOUBnrCBJnyNC6bemvd7ZAYn005BlMRmLU');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log('handlesubmit');

    if (elements == null) {
      return;
    }

    const stripeRes = await stripe?.confirmPayment({
      elements,
      confirmParams: {
        // todo -- find the way to use localhost
        return_url: `https://google.com`,
      },
    });

    console.log('====================================');
    console.log('stripe res', stripeRes);
    console.log('====================================');
  };

  return (
    <form>
      <PaymentElement />
      <Button onClick={handleSubmit} colorScheme={'brand'} mt={'1rem'} w={'100%'} disabled={!stripe}>
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
