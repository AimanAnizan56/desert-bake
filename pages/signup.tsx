import { Box, Button, Container, Text, Heading, Input, InputGroup, InputRightElement, Checkbox, Alert, AlertIcon, InputLeftElement } from '@chakra-ui/react';
import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import { EyeIcon, EyeSlashIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import axios, { AxiosError } from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef, MutableRefObject } from 'react';
import { GetServerSideProps } from 'next';
import { withIronSessionSsr } from 'iron-session/next';
import { ironSessionOptions } from '../lib/helper';
import { useRouter } from 'next/router';

const SignUp = () => {
  const router = useRouter();
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;

  const [emailError, setEmailError] = useState<undefined | boolean>(undefined);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState<undefined | boolean>(undefined);
  const [rePasswordError, setRePasswordError] = useState<undefined | boolean>(undefined);
  const [alertOn, setAlertOn] = useState({
    status: undefined as 'success' | 'info' | 'warning' | 'error' | 'loading' | undefined,
    trigger: false,
    message: 'Alert',
  });
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [checkboxTerm, setCheckboxTerm] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  useEffect(() => {
    if (name.length != 0 && email.length != 0 && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) && password.length != 0 && rePassword.length != 0 && password == rePassword && /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password) && checkboxTerm) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [name, email, password, rePassword, checkboxTerm]);

  const handleSubmit = async () => {
    setButtonLoading(true);

    if (emailError) {
      setAlertOn({
        status: 'error',
        trigger: true,
        message: 'Please change your email!',
      });
      emailRef.current.focus();
      setTimeout(() => {
        setButtonLoading(false);
      }, 500);
      setTimeout(() => {
        setAlertOn({
          ...alertOn,
          trigger: false,
        });
      }, 2500);
      return;
    }

    // ** submitting
    try {
      const res = await axios.post('/api/v1/customer', {
        name: name,
        email: email,
        password: password,
      });

      const { message, data } = res.data;

      if (res.status == 201) {
        setButtonLoading(false);
        setAlertOn({
          status: 'success',
          trigger: true,
          message: message,
        });

        setTimeout(() => {
          setAlertOn({
            ...alertOn,
            trigger: false,
          });

          router.push('/signin');
        }, 2500);

        setName('');
        setEmail('');
        setPassword('');
        setRePassword('');
        setCheckboxTerm(false);
        console.log('User Data', data);
      }
    } catch (err) {
      type ServerError = {
        detail: string;
        message: string;
      };
      // *** Axios error catch
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<ServerError>;
        if (serverError && serverError.response) {
          console.log('server error data', serverError.response.data);
          const { message } = serverError.response.data;

          if (message) {
            setAlertOn({
              trigger: true,
              status: 'error',
              message: message,
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

  const handleEmailBlur = async () => {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailErrorMessage('Email is invalid!');
      setEmailError(true);
      return;
    }
    const res = await axios.post('/api/v1/customer/validate', { email: email });
    const { error }: { error: boolean; message: string } = res.data;

    if (error) {
      setEmailErrorMessage('Email already exist!');
      setEmailError(true);
      return;
    }

    setEmailErrorMessage('');
    setEmailError(false);
  };

  const handlePasswordBlur = () => {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(password)) {
      setPasswordError(false);
      setRePasswordError(false);
      if (password != rePassword) {
        setRePasswordError(true);
      }
      return;
    }
    setPasswordError(true);
  };

  const handleReEnterPasswordBlur = () => {
    if (rePassword == password) {
      setRePasswordError(false);
      return;
    }
    setRePasswordError(true);
  };

  const handleCheckboxTerm = () => {
    setCheckboxTerm(!checkboxTerm);
  };

  return (
    <>
      <Head>
        <title>Desert Bake | Sign Up</title>
        <meta name="description" content="Desert Bake Sign Up" />
        <link rel="icon" href="/favicon.jpg" />
      </Head>

      <Container>
        <Box as="form" boxShadow={'0 8px 24px rgb(0 0 0 / 30%)'} borderRadius={'0.5rem'} px={8} py={5} mt={'5rem'}>
          <Heading as="h1" textAlign={'center'} mb="2rem" color={'brand.500'}>
            Sign Up
          </Heading>

          <InputGroup mb="1rem">
            <InputLeftElement pointerEvents="none" children={<UserCircleIcon width={'20px'} height={'20px'} color={'#718096'} />} />
            <Input variant={'filled'} bgColor={'brand.50'} _hover={{ bgColor: 'brand.100' }} focusBorderColor={'brand.500'} placeholder="Enter name" type="text" value={name} onChange={(e) => setName(e.target.value)} isRequired />
          </InputGroup>

          <Box as="div" mb="1rem">
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<EmailIcon color={!emailError ? 'gray.500' : 'red'} />} />
              <Input
                variant={'filled'}
                bgColor={'brand.50'}
                _hover={{ bgColor: 'brand.100' }}
                focusBorderColor={'brand.500'}
                placeholder="Enter email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                isInvalid={emailError}
                ref={emailRef}
                onFocus={() => setEmailError(false)}
                isRequired
              />
            </InputGroup>
            {emailError && (
              <Text ml="0.3rem" color="red" fontWeight="bold" fontSize="0.7rem" mt={'0.1rem'}>
                {emailErrorMessage}
              </Text>
            )}
          </Box>

          <Box as="div" mb="1rem">
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<LockIcon color={'gray.500'} />} />
              <Input
                variant={'filled'}
                bgColor={'brand.50'}
                _hover={{ bgColor: 'brand.100' }}
                pr="4.5rem"
                focusBorderColor={'brand.500'}
                value={password}
                onBlur={handlePasswordBlur}
                onFocus={() => setPasswordError(false)}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? 'text' : 'password'}
                placeholder={'Enter password'}
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
                  onClick={() => setShowPass(!showPass)}
                  onKeyDown={(e) => {
                    if (e.key == 'Enter' || e.keyCode == 32) setShowPass(!showPass);
                  }}
                >
                  {showPass ? <EyeIcon /> : <EyeSlashIcon />}
                </Box>
              </InputRightElement>
            </InputGroup>

            {passwordError && (
              <Text ml="0.3rem" color="red" fontWeight="bold" fontSize="0.7rem" mt={'0.1rem'}>
                Password must be at least 8 length, including lowercase, uppercase, number and special character!
              </Text>
            )}
          </Box>

          <Box as="div" mb="1rem">
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<LockIcon color={'gray.500'} />} />
              <Input
                variant={'filled'}
                bgColor={'brand.50'}
                _hover={{ bgColor: 'brand.100' }}
                pr="4.5rem"
                focusBorderColor={'brand.500'}
                value={rePassword}
                onBlur={handleReEnterPasswordBlur}
                onFocus={() => setRePasswordError(false)}
                onChange={(e) => setRePassword(e.target.value)}
                type={showRePass ? 'text' : 'password'}
                placeholder={'Re-enter password'}
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
                  onClick={() => setShowRePass(!showRePass)}
                  onKeyDown={(e) => {
                    if (e.key == 'Enter' || e.keyCode == 32) setShowRePass(!showRePass);
                  }}
                >
                  {showRePass ? <EyeIcon /> : <EyeSlashIcon />}
                </Box>
              </InputRightElement>
            </InputGroup>

            {rePasswordError && (
              <Text ml="0.3rem" color="red" fontWeight="bold" fontSize="0.7rem" mt={'0.1rem'}>
                Password not match
              </Text>
            )}
          </Box>

          <Box as="div">
            <Checkbox w={'100%'} px={'.7rem'} isChecked={checkboxTerm} onChange={() => handleCheckboxTerm()}>
              <Text fontSize={'0.8rem'}>
                By signing up, you accept the{' '}
                <Box as="span" color={'blue.300'} fontWeight={'bold'} _hover={{ textDecoration: 'underline' }}>
                  <Link href="/">Term and service</Link>
                </Box>{' '}
                and{' '}
                <Box as="span" color={'blue.300'} fontWeight={'bold'} _hover={{ textDecoration: 'underline' }}>
                  <Link href="/">Privacy Policy</Link>
                </Box>
              </Text>
            </Checkbox>
          </Box>

          <Button w={'100%'} mt={'0.8rem'} isDisabled={isButtonDisabled} isLoading={buttonLoading} loadingText={'Submitting'} onClick={handleSubmit} bg={'brand.500'} color={'white'} _hover={{ background: 'brand.600' }}>
            Submit
          </Button>

          <Text fontSize={'0.8rem'} mt={'0.8rem'} textAlign={'center'}>
            Already have an account?{' '}
            <Box as="span" color={'blue.300'} fontWeight={'bold'} _hover={{ textDecoration: 'underline' }}>
              <Link href={'/signin'}>Log In</Link>
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

export default SignUp;

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
