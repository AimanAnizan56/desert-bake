import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import { Box, Container, Heading, InputGroup, InputLeftElement, Input, InputRightElement, Button, Alert, AlertIcon, Text } from '@chakra-ui/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import axios, { AxiosError } from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { ironSessionOptions } from '../../lib/helper';

const SignIn = () => {
  const router = useRouter();
  const [adminData, setAdminData] = useState({
    email: '' as string,
    password: '' as string,
  });

  const [emailError, setEmailError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [buttonState, setButtonState] = useState({
    isDisabled: true,
    isLoading: false,
  });
  const [alertOn, setAlertOn] = useState({
    trigger: false,
    status: undefined as 'success' | 'info' | 'warning' | 'error' | 'loading' | undefined,
    message: '',
  });

  const handleEmailOnBlur = () => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(adminData.email)) {
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
      const res = await axios.post('/api/v1/admin/auth', {
        ...adminData,
      });

      // redirect user to admin homepage if success
      const { error } = res.data;
      if (!error) {
        setButtonState({
          ...buttonState,
          isLoading: false,
        });
        router.push('/admin/');
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

  const changeButtonDisabled = useCallback((isDisabled: boolean) => {
    setButtonState((prev) => ({
      ...prev,
      isDisabled: isDisabled,
    }));
  }, []);

  useEffect(() => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(adminData.email) && adminData.password.length > 0) {
      changeButtonDisabled(false);
      return;
    }

    changeButtonDisabled(true);
  }, [adminData.email, adminData.password, changeButtonDisabled]);

  return (
    <>
      <Head>
        <title>Dessert Bake | Admin Sign In</title>
        <meta name="description" content="Dessert Bake Admin Sign In" />
        <link rel="icon" href="/favicon.jpg" />
      </Head>

      <Container>
        <Box as="form" boxShadow={'var(--box-shadow)'} borderRadius={'0.5rem'} px={8} py={5} mt={'5rem'}>
          <Heading as="h1" textAlign={'center'} mb="2rem" color={'brand.500'}>
            Admin Sign In
          </Heading>

          <Box as="div" mb="1rem">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <EmailIcon color={'gray.300'} />
              </InputLeftElement>
              <Input
                focusBorderColor={'brand.500'}
                placeholder="Enter email"
                type="email"
                value={adminData.email}
                onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
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
            <InputLeftElement pointerEvents="none">
              <LockIcon color={'gray.300'} />
            </InputLeftElement>
            <Input
              pr="4.5rem"
              focusBorderColor={'brand.500'}
              value={adminData.password}
              onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
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
        permanent: true,
      },
      props: {},
    };
  }

  return {
    props: {},
  };
}, ironSessionOptions);
