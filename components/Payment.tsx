import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { Box, Button, Divider, Flex, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { useState } from 'react';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';

const stripePromise = loadStripe('pk_test_51MLMB4Iojr912iY5E3Zoy28Lr8HCl9wPlHoBOfa1Qyf1AbQqIv0xc2QFgHrVk4hEpOUBnrCBJnyNC6bemvd7ZAYn005BlMRmLU');

const CheckoutForm = ({ modalSuccessState, setModalSuccessState }: any) => {
  const stripe = useStripe();
  const elements = useElements();

  const [buttonState, setButtonState] = useState({
    isLoading: false,
    isDisabled: true,
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
          return_url: `https://${window.location.host}/payment/complete`,
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
        setButtonState({
          ...buttonState,
          isLoading: false,
        });
        setModalSuccessState({
          ...modalSuccessState,
          isOpen: true,
        });
      }
    } catch (err) {
      console.log('====================================');
      console.log('stripe confirm payment error');
      console.log(err);
      console.log('====================================');
    }
  };

  const handleFormChange = (event: any) => {
    console.log('element type ', event.value.type);
    if (event.value.type == 'grabpay' || !(event.empty || !event.complete)) {
      setButtonState({ ...buttonState, isDisabled: false });
      return;
    }
    setButtonState({ ...buttonState, isDisabled: true });
  };

  return (
    <form>
      <PaymentElement onChange={handleFormChange} />
      <Button onClick={handleSubmit} colorScheme={'brand'} mt={'1rem'} w={'100%'} disabled={buttonState.isDisabled} isLoading={buttonState.isLoading}>
        Pay Now
      </Button>
    </form>
  );
};

const Payment = ({ clientSecret, totalPrice, paymentId }: any) => {
  const router = useRouter();
  const [modalSuccessState, setModalSuccessState] = useState({
    isOpen: false,
    onClose: () => {
      console.log('do nothing');
    },
  });

  return (
    <>
      {clientSecret && (
        <>
          <Box as="div" borderRadius={'10px'} boxShadow={'var(--box-shadow)'} pt={'1.3rem'} pb={'2rem'} px={'2rem'}>
            <Box as="h1" fontWeight="bold" fontSize={'1.3rem'} mb={'0.5rem'}>
              Payment Details
            </Box>
            <Elements stripe={stripePromise} options={{ clientSecret: clientSecret }}>
              <CheckoutForm modalSuccessState={modalSuccessState} setModalSuccessState={setModalSuccessState} />
            </Elements>
          </Box>
        </>
      )}

      <Modal isOpen={modalSuccessState.isOpen} onClose={modalSuccessState.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pb={0}>
            <Box as="div" color={'green.400'}>
              <CheckCircleIcon width={'10rem'} height={'10rem'} style={{ margin: '0 auto' }} />
            </Box>
            <Box as="div" color={'green.400'} textAlign={'center'}>
              Payment Successful
            </Box>
            <Flex gap={2} fontWeight={'normal'} fontSize={'0.9rem'} color="gray.500" justifyContent={'center'}>
              <Box as="span">{paymentId}</Box>
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Divider borderBottomWidth={'0.2rem'} />
            <Box as="div" maxW={'70%'} m={'0 auto'} mt={'0.5rem'} color={'gray.500'}>
              <Flex alignItems={'center'} justifyContent={'space-between'}>
                <Box as="span">Amount paid</Box>
                <Box as="span">RM {totalPrice}</Box>
              </Flex>
            </Box>
          </ModalBody>

          <ModalFooter justifyContent={'center'}>
            <Button
              colorScheme={'green'}
              onClick={() => {
                router.push('/order');
              }}
            >
              Go to Orders
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Payment;
