import { Box, Container, Input, InputGroup, InputLeftElement, Heading, Button, Text, Flex, InputRightElement, Alert, AlertIcon } from '@chakra-ui/react';
import { EyeIcon, EyeSlashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Navbar from '../../../components/Navbar';
import { ironSessionOptions } from '../../../lib/helper';
import { useCallback, useEffect, useState } from 'react';
import { EmailIcon, LockIcon } from '@chakra-ui/icons';
import axios from 'axios';

const inputFocusVisible = { borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' };
const buttonFocusVisible = { boxShadow: '0 0 0 3px var(--chakra-colors-brand-200)' };

const Profile = (props: any) => {
  type User = {
    id: string;
    name: string;
    email: string;
    admin: boolean;
  };
  const { user }: { user: User } = props;

  const [formVal, setFormVal] = useState({
    name: user.name,
    email: user.email,
  });

  const [formPassVal, setFormPassVal] = useState({
    currPass: '',
    password: '',
    confPassword: '',
  });

  const [currentForm, setCurrentForm] = useState('change-details');

  const [buttonState, setButtonState] = useState({
    isLoading: false,
    isDisabled: false,
  });

  const [buttonStatePassword, setButtonStatePassword] = useState({
    isLoading: false,
    isDisabled: false,
  });

  const [error, setError] = useState({
    name: false,
    email: false,
    currPass: false,
    password: false,
    confPassword: false,
  });

  const [alertOn, setAlertOn] = useState({
    status: undefined as 'success' | 'info' | 'warning' | 'error' | 'loading' | undefined,
    trigger: false,
    message: 'Alert',
  });

  const [showInput, setShowInput] = useState({
    currPass: false,
    password: false,
    confPassword: false,
  });

  const changeButtonDisabled = useCallback((isDisabled: boolean) => {
    setButtonState((prev) => ({
      ...prev,
      isDisabled: isDisabled,
    }));
  }, []);

  useEffect(() => {
    if (formVal.name.length != 0 && formVal.email.length != 0 && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formVal.email)) {
      changeButtonDisabled(false);
      return;
    }
    changeButtonDisabled(true);
  }, [formVal.name, formVal.email, changeButtonDisabled]);

  const changeButtonPasswordDisabled = useCallback((isDisabled: boolean) => {
    setButtonStatePassword((prev) => ({
      ...prev,
      isDisabled: isDisabled,
    }));
  }, []);

  useEffect(() => {
    if (error.password || error.confPassword || formPassVal.currPass.length == 0 || formPassVal.password.length == 0 || formPassVal.confPassword.length == 0) {
      changeButtonPasswordDisabled(true);
      return;
    }
    changeButtonPasswordDisabled(false);
  }, [error.password, error.confPassword, formPassVal.currPass, formPassVal.password, formPassVal.confPassword, changeButtonPasswordDisabled]);

  const handleEmailValidation = () => {
    if (formVal.email.length != 0 && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formVal.email)) {
      setError((prev) => ({
        ...prev,
        email: false,
      }));
      return;
    }
    setError((prev) => ({
      ...prev,
      email: true,
    }));

    console.log(error);
  };

  const handlePasswordBlur = () => {
    // do password validation
    console.log('password validation');
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(formPassVal.password)) {
      setError((prev) => ({
        ...prev,
        password: false,
        confPassword: false,
      }));
      if (formPassVal.password != formPassVal.confPassword) {
        setError((prev) => ({
          ...prev,
          confPassword: true,
        }));
      }
      return;
    }
    setError((prev) => ({
      ...prev,
      password: true,
    }));
  };

  const handleConfPasswordBlur = () => {
    // do confirmpassword validation
    if (formPassVal.confPassword == formPassVal.password) {
      setError((prev) => ({
        ...prev,
        confPassword: false,
      }));
      return;
    }
    setError((prev) => ({
      ...prev,
      confPassword: true,
    }));
  };

  const handleUpdate = async (event: any) => {
    event.preventDefault();

    const url = `/api/v1/admin/${user.id}`;

    if (formVal.name.length == 0 || formVal.email.length == 0) {
      return;
    }

    try {
      const res = await axios.put(url, {
        name: formVal.name,
        email: formVal.email,
      });

      const { message } = res.data;

      if (res.status == 200) {
        setAlertOn((prev) => ({
          ...prev,
          message: message,
          status: 'success',
          trigger: true,
        }));
      }
    } catch (err: any) {
      const { message } = err.response.data;

      setAlertOn((prev) => ({
        ...prev,
        message: message,
        status: 'error',
        trigger: true,
      }));
    }

    setTimeout(() => {
      setAlertOn((prev) => ({
        ...prev,
        trigger: false,
      }));
    }, 3000);
  };

  const handlePasswordUpdate = async (event: any) => {
    event.preventDefault();

    const url = `/api/v1/admin/${user.id}`;

    if (formPassVal.currPass.length == 0 || formPassVal.password.length == 0 || formPassVal.confPassword.length == 0) {
      return;
    }

    try {
      const res = await axios.put(url, {
        current_password: formPassVal.currPass,
        new_password: formPassVal.password,
      });

      const { message } = res.data;

      if (res.status == 200) {
        setAlertOn((prev) => ({
          ...prev,
          message: message,
          status: 'success',
          trigger: true,
        }));

        setFormPassVal({
          password: '',
          currPass: '',
          confPassword: '',
        });
      }
    } catch (err: any) {
      const { message } = err.response.data;

      setAlertOn((prev) => ({
        ...prev,
        message: message,
        status: 'error',
        trigger: true,
      }));
    }

    setTimeout(() => {
      setAlertOn((prev) => ({
        ...prev,
        trigger: false,
      }));
    }, 3000);
  };

  return (
    <>
      <Navbar pageTitle="My Profile" pageDescription="Profile for admin" currentPage="My Profile" user={props.user} />

      <main>
        <Container maxW={'container.sm'} my={'2rem'}>
          <Box as="div" mt={'2rem'} p={'2rem 1.4rem'}>
            <Heading as="h1" size={'md'} mb={'1.5rem'}>
              My Profile
            </Heading>

            {currentForm == 'change-details' && (
              <form>
                <Box as="div" mb={'0.5rem'}>
                  <Text>Name</Text>

                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <UserCircleIcon width={'20px'} height={'20px'} color={'var(--chakra-colors-gray-300)'} />
                    </InputLeftElement>
                    <Input type="text" placeholder="Admin Name" value={formVal.name} onChange={(e) => setFormVal((prev) => ({ ...prev, name: e.target.value }))} focusBorderColor={'brand.500'} _focusVisible={inputFocusVisible} />
                  </InputGroup>
                </Box>

                <Box as="div" mb={'2rem'}>
                  <Text>Email</Text>

                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <EmailIcon color={!error.email ? 'gray.300' : 'red'} />
                    </InputLeftElement>
                    <Input type="text" isInvalid={error.email} placeholder="hello@admin.com" value={formVal.email} onChange={(e) => setFormVal((prev) => ({ ...prev, email: e.target.value }))} onBlur={handleEmailValidation} focusBorderColor={'brand.500'} _focusVisible={inputFocusVisible} />
                  </InputGroup>
                  {error.email && (
                    <Text ml="0.3rem" color="red" fontWeight="bold" fontSize="0.7rem" mt={'0.1rem'}>
                      Email is invalid
                    </Text>
                  )}
                </Box>

                <Flex gap={'0.5rem'} direction={'column'} maxW={'15rem'} mx={'auto'}>
                  <Button colorScheme={'brand'} isLoading={buttonState.isLoading} isDisabled={buttonState.isDisabled} onClick={handleUpdate} _focusVisible={buttonFocusVisible}>
                    Update Profile
                  </Button>
                  <Button variant={'outline'} colorScheme={'brand'} onClick={() => setCurrentForm('change-password')} _focusVisible={buttonFocusVisible}>
                    Change Password
                  </Button>
                </Flex>
              </form>
            )}

            {currentForm == 'change-password' && (
              <form>
                <Box as="div" mb="0.5rem">
                  <Text>Current Password</Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <LockIcon color={'gray.300'} />
                    </InputLeftElement>
                    <Input
                      pr="4.5rem"
                      focusBorderColor={'brand.500'}
                      _focusVisible={inputFocusVisible}
                      value={formPassVal.currPass}
                      onFocus={() => setError((prev) => ({ ...prev, currPass: false }))}
                      onChange={(e) => setFormPassVal((prev) => ({ ...prev, currPass: e.target.value }))}
                      type={showInput.currPass ? 'text' : 'password'}
                      placeholder={'Enter current password'}
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
                        onClick={() => setShowInput((prev) => ({ ...prev, currPass: !showInput.currPass }))}
                        onKeyDown={(e) => {
                          if (e.key == 'Enter' || e.keyCode == 32) setShowInput((prev) => ({ ...prev, currPass: !showInput.currPass }));
                        }}
                      >
                        {showInput.currPass ? <EyeIcon /> : <EyeSlashIcon />}
                      </Box>
                    </InputRightElement>
                  </InputGroup>
                </Box>

                <Box as="div" mb="0.5rem">
                  <Text>New Password</Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <LockIcon color={'gray.300'} />
                    </InputLeftElement>
                    <Input
                      pr="4.5rem"
                      focusBorderColor={'brand.500'}
                      _focusVisible={inputFocusVisible}
                      value={formPassVal.password}
                      onBlur={handlePasswordBlur}
                      onFocus={() => setError((prev) => ({ ...prev, password: false }))}
                      onChange={(e) => setFormPassVal((prev) => ({ ...prev, password: e.target.value }))}
                      type={showInput.password ? 'text' : 'password'}
                      placeholder={'Enter new password'}
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
                        onClick={() => setShowInput((prev) => ({ ...prev, password: !showInput.password }))}
                        onKeyDown={(e) => {
                          if (e.key == 'Enter' || e.keyCode == 32) setShowInput((prev) => ({ ...prev, password: !showInput.password }));
                        }}
                      >
                        {showInput.password ? <EyeIcon /> : <EyeSlashIcon />}
                      </Box>
                    </InputRightElement>
                  </InputGroup>

                  {error.password && (
                    <Text ml="0.3rem" color="red" fontWeight="bold" fontSize="0.7rem" mt={'0.1rem'}>
                      Password must be at least 8 length, including lowercase, uppercase, number and special character!
                    </Text>
                  )}
                </Box>

                <Box as="div" mb="2rem">
                  <Text>Confirm Password</Text>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <LockIcon color={'gray.300'} />
                    </InputLeftElement>
                    <Input
                      pr="4.5rem"
                      focusBorderColor={'brand.500'}
                      _focusVisible={inputFocusVisible}
                      value={formPassVal.confPassword}
                      onBlur={handleConfPasswordBlur}
                      onFocus={() => setError((prev) => ({ ...prev, confPassword: false }))}
                      onChange={(e) => setFormPassVal((prev) => ({ ...prev, confPassword: e.target.value }))}
                      type={showInput.confPassword ? 'text' : 'password'}
                      placeholder={'Re-enter new password'}
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
                        onClick={() => setShowInput((prev) => ({ ...prev, confPassword: !showInput.confPassword }))}
                        onKeyDown={(e) => {
                          if (e.key == 'Enter' || e.keyCode == 32) setShowInput((prev) => ({ ...prev, confPassword: !showInput.confPassword }));
                        }}
                      >
                        {showInput.confPassword ? <EyeIcon /> : <EyeSlashIcon />}
                      </Box>
                    </InputRightElement>
                  </InputGroup>

                  {error.confPassword && (
                    <Text ml="0.3rem" color="red" fontWeight="bold" fontSize="0.7rem" mt={'0.1rem'}>
                      Password did not match!
                    </Text>
                  )}
                </Box>

                <Flex gap={'0.5rem'} direction={'column'} maxW={'15rem'} mx={'auto'}>
                  <Button colorScheme={'brand'} isLoading={buttonStatePassword.isLoading} isDisabled={buttonStatePassword.isDisabled} onClick={handlePasswordUpdate} _focusVisible={buttonFocusVisible}>
                    Update Password
                  </Button>
                  <Button variant={'outline'} colorScheme={'brand'} onClick={() => setCurrentForm('change-details')} _focusVisible={buttonFocusVisible}>
                    Back
                  </Button>
                </Flex>
              </form>
            )}
          </Box>
        </Container>
      </main>

      {alertOn.trigger && (
        <Alert status={alertOn.status} w="30vw" mx="auto" position={'fixed'} left={'50vw'} bottom={'2rem'} transform={'translateX(-50%)'}>
          <AlertIcon />
          {alertOn.message}
        </Alert>
      )}
    </>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({ req }) => {
  const user = req.session.user;

  if (user && user.admin) {
    return {
      props: {
        user: user,
      },
    };
  }

  return {
    redirect: {
      destination: '/admin/signin',
      permanent: true,
    },
    props: {},
  };
}, ironSessionOptions);
