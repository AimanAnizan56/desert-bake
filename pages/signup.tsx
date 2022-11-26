import { Box, Button, Container, Text, Heading, Input, InputGroup, InputRightElement, Checkbox } from '@chakra-ui/react';
import { Dispatch, SetStateAction, useState } from 'react';

const PasswordComponent = ({ state, setState, placeholder, value, onChange }: { state: boolean; setState: Dispatch<SetStateAction<boolean>>; placeholder: string; value: string; onChange: Dispatch<SetStateAction<string>> }) => {
  return (
    <InputGroup size="md" mb="1rem">
      <Input variant={'filled'} pr="4.5rem" focusBorderColor={'brand.500'} value={value} onChange={(e) => onChange(e.target.value)} type={state ? 'text' : 'password'} placeholder={placeholder} isRequired />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={() => setState(!state)}>
          {state ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

const SignUp = () => {
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [checkboxTerm, setCheckboxTerm] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  const handleSubmit = () => {
    setButtonLoading(true);
    console.log('submitting');
  };

  const handleCheckboxTerm = () => {
    console.log('checkbox handler');
    setCheckboxTerm(!checkboxTerm);
    setButtonDisabled(checkboxTerm);
  };

  return (
    <Container>
      <Box as="form" boxShadow={'dark-lg'} borderRadius={'0.5rem'} px={8} py={5} mt={'8rem'}>
        <Heading as="h1" textAlign={'center'} mb="2rem" color={'brand.500'}>
          Sign Up
        </Heading>
        <Input variant={'filled'} mb="1rem" focusBorderColor={'brand.500'} placeholder="Enter name" type="text" value={name} onChange={(e) => setName(e.target.value)} isRequired />
        <Input variant={'filled'} mb="1rem" focusBorderColor={'brand.500'} placeholder="Enter email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} isRequired />

        <PasswordComponent value={password} onChange={setPassword} state={showPass} setState={setShowPass} placeholder="Enter password" />
        <PasswordComponent value={rePassword} onChange={setRePassword} state={showRePass} setState={setShowRePass} placeholder="Re-enter password" />

        <Box as="div">
          <Checkbox w={'100%'} px={'.7rem'} isChecked={checkboxTerm} onChange={() => handleCheckboxTerm()}>
            <Text fontSize={'0.8rem'}>
              By signing up, you accept the{' '}
              <Box as="span" color={'blue.300'} fontWeight={'bold'}>
                Term and service
              </Box>{' '}
              and{' '}
              <Box as="span" color={'blue.300'} fontWeight={'bold'}>
                Privacy Policy
              </Box>
            </Text>
          </Checkbox>
        </Box>

        <Button w={'100%'} mt={'0.8rem'} isDisabled={isButtonDisabled} isLoading={buttonLoading} loadingText={'Submitting'} onClick={handleSubmit} bg={'brand.500'} color={'white'} _hover={{ background: 'brand.600' }}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default SignUp;
