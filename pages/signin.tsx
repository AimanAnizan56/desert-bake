import { Alert, AlertIcon, Box, Button, Container, Heading, Input, InputGroup, InputLeftElement, InputRightElement, Text } from '@chakra-ui/react';
import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import { ironSessionOptions } from '../lib/helper';
import { useRouter } from 'next/router';
import { Loading } from '../components/Loading';

const SignIn = () => {
  const router = useRouter();
  const [alertOn, setAlertOn] = useState({
    trigger: false,
    status: undefined as 'success' | 'info' | 'warning' | 'error' | 'loading' | undefined,
    message: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [buttonState, setButtonState] = useState({
    isDisabled: true,
    isLoading: false,
  });

  const [customerData, setCustomerData] = useState({
    email: '' as string,
    password: '' as string,
  });

  const handleEmailOnBlur = () => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(customerData.email)) {
      setEmailError(false);
      return;
    }
    setEmailError(true);
  };

  const handleSubmit = async () => {
    type ServerError = {
      error: boolean;
      message: string;
    };

    if (buttonState.isDisabled) {
      return;
    }

    setButtonState({
      ...buttonState,
      isLoading: true,
    });

    try {
      const res = await axios.post('/api/v1/customer/auth', {
        ...customerData,
      });

      // redirect user to homepage if success
      const { error } = res.data;
      if (!error) {
        setButtonState({
          ...buttonState,
          isLoading: false,
        });
        router.push('/');
      }
    } catch (err) {
      // *** Axios error catch
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<ServerError>;
        if (serverError && serverError.response) {
          console.log('server error data', serverError.response.data);
          const { error, message } = serverError.response.data;

          if (error) {
            setButtonState({
              ...buttonState,
              isLoading: false,
            });
            setAlertOn({
              trigger: true,
              status: 'error',
              message: message == 'Login failed' ? 'Your email or password is incorrect' : message,
            });

            setTimeout(() => {
              setAlertOn({
                ...alertOn,
                trigger: false,
              });
            }, 3000);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(customerData.email) && customerData.password.length > 0) {
      setButtonState({ ...buttonState, isDisabled: false });
      return;
    }

    setButtonState({ ...buttonState, isDisabled: true });
  }, [customerData.email, customerData.password]);

  return (
    <>
      <Head>
        <title>Desert Bake | Sign In</title>
        <meta name="description" content="Desert Bake Sign In" />
        <link rel="icon" href="/favicon.jpg" />
      </Head>

      <Container>
        <Box as="form" boxShadow={'var(--box-shadow)'} borderRadius={'0.5rem'} px={8} py={5} mt={'5rem'}>
          <Heading as="h1" textAlign={'center'} mb="2rem" color={'brand.500'}>
            Sign In
          </Heading>

          <Box as="div" mb="1rem">
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<EmailIcon color={'gray.500'} />} />
              <Input
                variant={'filled'}
                bgColor={'brand.50'}
                _hover={{ bgColor: 'brand.100' }}
                focusBorderColor={'brand.500'}
                placeholder="Enter email"
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                isInvalid={emailError}
                onBlur={handleEmailOnBlur}
                onFocus={() => setEmailError(false)}
                onKeyDown={(e) => {
                  if (e.key == 'Enter') {
                    handleSubmit();
                  }
                }}
                isRequired
              />
            </InputGroup>
            {emailError && (
              <Text ml="0.3rem" color="red" fontWeight="bold" fontSize="0.7rem" mt={'0.1rem'}>
                Email is invalid!
              </Text>
            )}
          </Box>

          <InputGroup size="md" mb="1rem">
            <InputLeftElement pointerEvents="none" children={<LockIcon color={'gray.500'} />} />
            <Input
              variant={'filled'}
              bgColor={'brand.50'}
              _hover={{ bgColor: 'brand.100' }}
              pr="4.5rem"
              focusBorderColor={'brand.500'}
              value={customerData.password}
              onChange={(e) => setCustomerData({ ...customerData, password: e.target.value })}
              type={showPassword ? 'text' : 'password'}
              placeholder={'Enter password'}
              onKeyDown={(e) => {
                if (e.key == 'Enter') {
                  handleSubmit();
                }
              }}
              isRequired
            />
            <InputRightElement width="4.5rem">
              <Box
                tabIndex={0}
                h="1.75rem"
                w="1rem"
                color={'gray.500'}
                cursor={'pointer'}
                _hover={{ color: 'gray.700' }}
                display="flex"
                justifyContent={'center'}
                onClick={() => setShowPassword(!showPassword)}
                onKeyDown={(e) => {
                  if (e.key == 'Enter' || e.keyCode == 32) setShowPassword(!showPassword);
                }}
              >
                {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
              </Box>
            </InputRightElement>
          </InputGroup>

          <Button w={'100%'} mt={'0.8rem'} isDisabled={buttonState.isDisabled} isLoading={buttonState.isLoading} loadingText={'Please wait...'} onClick={handleSubmit} bg={'brand.500'} color={'white'} _hover={{ background: 'brand.600' }}>
            Login
          </Button>
          <Text fontSize={'0.8rem'} mt={'0.8rem'} textAlign={'center'}>
            Does not have an account?{' '}
            <Box as="span" color={'blue.300'} fontWeight={'bold'} _hover={{ textDecoration: 'underline' }}>
              <Link href={'/signup'}>Create Account</Link>
            </Box>
          </Text>
        </Box>
      </Container>

      {alertOn.trigger && (
        <Alert status={alertOn.status} w="30vw" mx="auto" position={'fixed'} left={'50vw'} bottom={'2rem'} transform={'translateX(-50%)'}>
          <AlertIcon />
          {alertOn.message}
        </Alert>
      )}
    </>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({ req }) => {
  const user = req.session.user;

  if (user) {
    return {
      redirect: {
        destination: user.admin ? '/admin/' : '/',
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
}, ironSessionOptions);
