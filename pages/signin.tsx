import { Alert, AlertIcon, Box, Button, Checkbox, Container, Heading, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';

const SignIn = () => {
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
    handleSubmit: async () => {
      console.log('handle submit');
    },
  });

  const [customerData, setCustomerData] = useState({
    email: '' as string,
    password: '' as string,
  });

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
        <title>Desert Bake | Sign Up</title>
        <meta name="description" content="Desert Bake Sign Up" />
        <link rel="icon" href="/favicon.jpg" />
      </Head>

      <Container>
        <Box as="form" boxShadow={'dark-lg'} borderRadius={'0.5rem'} px={8} py={5} mt={'5rem'}>
          <Heading as="h1" textAlign={'center'} mb="2rem" color={'brand.500'}>
            Sign In
          </Heading>

          <Box as="div" mb="1rem">
            <Input variant={'filled'} focusBorderColor={'brand.500'} placeholder="Enter email" type="email" value={customerData.email} onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })} isInvalid={emailError} isRequired />
          </Box>

          <InputGroup size="md" mb="1rem">
            <Input variant={'filled'} pr="4.5rem" focusBorderColor={'brand.500'} value={customerData.password} onChange={(e) => setCustomerData({ ...customerData, password: e.target.value })} type={showPassword ? 'text' : 'password'} placeholder={'Enter password'} isRequired />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>

          <Button w={'100%'} mt={'0.8rem'} isDisabled={buttonState.isDisabled} isLoading={buttonState.isLoading} loadingText={'Logging'} onClick={buttonState.handleSubmit} bg={'brand.500'} color={'white'} _hover={{ background: 'brand.600' }}>
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
