import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import { Box, Container, Heading, InputGroup, InputLeftElement, Input, InputRightElement, Button, Alert, AlertIcon, Text } from '@chakra-ui/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

const SignIn = () => {
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
    // todo - submit to admin login api
  };

  return (
    <>
      <Head>
        <title>Desert Bake | Admin Sign In</title>
        <meta name="description" content="Desert Bake Admin Sign In" />
        <link rel="icon" href="/favicon.jpg" />
      </Head>

      <Container>
        <Box as="form" boxShadow={'dark-lg'} borderRadius={'0.5rem'} px={8} py={5} mt={'5rem'}>
          <Heading as="h1" textAlign={'center'} mb="2rem" color={'brand.500'}>
            Admin Sign In
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
                value={adminData.email}
                onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                isInvalid={emailError}
                onBlur={handleEmailOnBlur}
                onFocus={() => setEmailError(false)}
                onKeyDown={(e) => {
                  if (e.key == 'Enter') {
                    // handleSubmit();
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
              value={adminData.password}
              onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
              type={showPassword ? 'text' : 'password'}
              placeholder={'Enter password'}
              onKeyDown={(e) => {
                if (e.key == 'Enter') {
                  //  handleSubmit();
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

          <Button w={'100%'} mt={'0.8rem'} isDisabled={buttonState.isDisabled} isLoading={buttonState.isLoading} loadingText={'Please wait...'} /* onClick={handleSubmit} */ bg={'brand.500'} color={'white'} _hover={{ background: 'brand.600' }}>
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