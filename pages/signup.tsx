import { Box, Button, Container, Text, Heading, Input, InputGroup, InputRightElement, Checkbox } from '@chakra-ui/react';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState, useEffect, useRef, MutableRefObject } from 'react';

const PasswordComponent = ({ state, setState, placeholder, value, onChange }: { state: boolean; setState: Dispatch<SetStateAction<boolean>>; placeholder: string; value: string; onChange: Dispatch<SetStateAction<string>> }) => {
  return (
    <>
      <Head>
        <title>Desert Bake | Sign Up</title>
        <meta name="description" content="Desert Bake Sign Up" />
        <link rel="icon" href="/favicon.jpg" />
      </Head>
      <InputGroup size="md" mb="1rem">
        <Input variant={'filled'} pr="4.5rem" focusBorderColor={'brand.500'} value={value} onChange={(e) => onChange(e.target.value)} type={state ? 'text' : 'password'} placeholder={placeholder} isRequired />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={() => setState(!state)}>
            {state ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>
    </>
  );
};

const SignUp = () => {
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;

  const [emailError, setEmailError] = useState<undefined | boolean>(undefined);
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

  const handleSubmit = () => {
    setButtonLoading(true);

    if (emailError) {
      console.log('quit submitting: email error');
      emailRef.current.focus();
      setTimeout(() => {
        setButtonLoading(false);
      }, 500);
      return;
    }
    console.log('submitting');
    setButtonLoading(false);
  };

  const handleEmailBlur = async () => {
    // todo -- change for later
    const res = await axios.post('/api/v1/customer/validate', { email: email });
    const { error }: { error: boolean; message: string } = res.data;

    if (error) {
      setEmailError(true);
      return;
    }

    setEmailError(false);
  };

  const handleCheckboxTerm = () => {
    setCheckboxTerm(!checkboxTerm);
  };

  return (
    <Container>
      <Box as="form" boxShadow={'dark-lg'} borderRadius={'0.5rem'} px={8} py={5} mt={'5rem'}>
        <Heading as="h1" textAlign={'center'} mb="2rem" color={'brand.500'}>
          Sign Up
        </Heading>
        <Input variant={'filled'} mb="1rem" focusBorderColor={'brand.500'} placeholder="Enter name" type="text" value={name} onChange={(e) => setName(e.target.value)} isRequired />
        <Box as="div" mb="1rem">
          <Input variant={'filled'} focusBorderColor={'brand.500'} placeholder="Enter email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailBlur} isInvalid={emailError} ref={emailRef} isRequired />
          {emailError && (
            <Text ml="0.3rem" color="red" fontWeight="bold" fontSize="0.8rem">
              Email already exist!
            </Text>
          )}
        </Box>
        <PasswordComponent value={password} onChange={setPassword} state={showPass} setState={setShowPass} placeholder="Enter password" />
        <PasswordComponent value={rePassword} onChange={setRePassword} state={showRePass} setState={setShowRePass} placeholder="Re-enter password" />
        <Box as="div">
          <Checkbox w={'100%'} px={'.7rem'} isChecked={checkboxTerm} onChange={() => handleCheckboxTerm()}>
            <Text fontSize={'0.8rem'}>
              By signing up, you accept the{' '}
              <Box as="span" color={'blue.300'} fontWeight={'bold'} _hover={{ textDecoration: 'underline' }}>
                Term and service
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
  );
};

export default SignUp;
