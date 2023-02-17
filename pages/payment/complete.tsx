import { Box, Button, Center, Flex, Heading, Text } from '@chakra-ui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ironSessionOptions } from '../../lib/helper';

const HeadTag = ({ title, description }: { title: string; description: string }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} key="desc" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <link rel="icon" href="/favicon.jpg" />
    </Head>
  );
};

const Complete = () => {
  const router = useRouter();
  const { payment_intent, payment_intent_client_secret, redirect_status } = router.query;

  if (payment_intent == undefined || payment_intent_client_secret == undefined || redirect_status == undefined) {
    return (
      <>
        <HeadTag title="Payment Error" description="Something wrong with your payment" />

        <Flex as="div" position="absolute" h="100%" w="100%" justifyContent="center" alignItems="center" flexDir="column">
          <Box as="div" borderRadius="0.3rem" p="1.5rem 2rem" w="23rem" boxShadow="var(--box-shadow)">
            <XCircleIcon width="7rem" color="var(--chakra-colors-red-400)" style={{ margin: '0 auto' }} />
            <Heading as="h3" size="md">
              <Text textAlign="center">Oh no!</Text>
            </Heading>
            <Heading as="h1" size="md" mb="1rem">
              <Text textAlign="center">Something went wrong</Text>
            </Heading>

            <Box as="p" textAlign="center" mb="1rem" color="red.400">
              We are&apos;t able to process your request. Please try again.
            </Box>

            <Box as="div" textAlign="center">
              <Button variant="outline" colorScheme="red" px="2rem" onClick={() => router.back()}>
                Back
              </Button>
            </Box>
          </Box>
        </Flex>
      </>
    );
  }

  return (
    <>
      <HeadTag title={redirect_status == 'succeeded' ? 'Payment Successful' : 'Payment Failed'} description={redirect_status ? 'The payment made is succeeded' : 'The payment made is failed'} />

      <Flex as="div" position="absolute" h="100%" w="100%" justifyContent="center" alignItems="center" flexDir="column">
        <Box as="div" borderRadius="0.3rem" p="1.5rem 2rem" w="23rem" boxShadow="var(--box-shadow)">
          {redirect_status == 'succeeded' ? <CheckCircleIcon width="7rem" color="var(--chakra-colors-green-400)" style={{ margin: '0 auto' }} /> : <XCircleIcon width="7rem" color="var(--chakra-colors-red-400)" style={{ margin: '0 auto' }} />}

          <Heading as="h1" size="md" mb="1rem">
            <Text textAlign="center">{redirect_status == 'succeeded' ? 'Payment Successful' : 'Payment Failed'}</Text>
          </Heading>

          <Box as="p" textAlign="center" mb="1rem" color={redirect_status == 'succeeded' ? '' : 'red.400'}>
            {redirect_status == 'succeeded' ? 'Thank you for your payment' : "You've cancelled the payment!"}
          </Box>

          <Box as="div" textAlign="center">
            <Button
              variant="outline"
              colorScheme={redirect_status == 'succeeded' ? 'green' : 'red'}
              px="2rem"
              onClick={() => {
                redirect_status == 'succeeded' ? router.replace('/order') : router.back();
              }}
            >
              {redirect_status == 'succeeded' ? 'Complete' : 'Back'}
            </Button>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default Complete;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({ req }) => {
  if (!req.session.user) {
    return {
      redirect: {
        permanent: true,
        destination: '/signin',
      },
    };
  }

  return {
    props: {
      user: req.session.user ? req.session.user : {},
    },
  };
}, ironSessionOptions);
