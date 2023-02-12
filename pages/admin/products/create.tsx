import { Box, Text, Container, Divider, Heading, Input, InputGroup, InputLeftElement, RadioGroup, Radio, Flex, Button, Alert, AlertIcon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { ChartPieIcon, ChatBubbleOvalLeftEllipsisIcon, ClipboardDocumentListIcon, CurrencyDollarIcon, PhotoIcon } from '@heroicons/react/24/outline';
import axios, { AxiosError } from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { ironSessionOptions } from '../../../lib/helper';
import { useRouter } from 'next/router';
import Image from 'next/image';

const CreateProduct = (props: any) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    type: 'cake',
    image: undefined,
  });
  const [productImageSrc, setProductImageSrc] = useState('/');

  const [alertOn, setAlertOn] = useState({
    status: undefined as 'success' | 'info' | 'warning' | 'error' | 'loading' | undefined,
    trigger: false,
    message: 'Alert',
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    onClose: () => {
      console.log('closing modal');
      setModalState({ ...modalState, isOpen: false });
    },
  });
  const [submitButton, setSubmitButton] = useState({
    isLoading: false,
  });

  const [buttonState, setButtonState] = useState({
    isLoading: false,
    isDisabled: true,
  });

  useEffect(() => {
    if (product.name.length > 0 && product.price.length > 0 && product.description.length > 0 && product.type.length > 0 && product.image != undefined) {
      changeButtonState({ ...buttonState, isDisabled: false });
      return;
    }
    changeButtonState({ ...buttonState, isDisabled: true });
  }, [product]);

  const changeButtonState = (state: { isLoading: boolean; isDisabled: boolean }) => {
    setButtonState(state);
  };

  const setImage = (e: any) => {
    // @ts-ignore
    if (e.target.files.length > 0) {
      let reader = new FileReader();

      reader.onload = (e) => {
        // @ts-ignore
        setProductImageSrc(e.target.result);
      };

      reader.readAsDataURL(e.target.files[0]);
      setProduct({ ...product, image: e.target.files[0] });
      return;
    }

    setProduct({ ...product, image: undefined });
    setProductImageSrc('/');
  };

  const handleConfirmation = async () => {
    // popup a modal to check confirmation
    setModalState({ ...modalState, isOpen: true });
  };

  const handleSubmit = async () => {
    setModalState({ ...modalState, isOpen: false });
    changeButtonState({
      ...buttonState,
      isLoading: true,
    });

    const formData = new FormData();
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const url = '/api/v1/products/';

    if (product.name.length == 0 || product.description.length == 0 || product.price.length == 0 || product.type.length == 0 || product.image == undefined) {
      return;
    }

    for (let key in product) {
      // @ts-ignore
      formData.append(key, product[key]);
    }

    try {
      // @ts-ignore
      for (let pair of formData.entries()) {
        console.log(pair);
      }
      const res = await axios.post(url, formData, config);

      const { message, data } = res.data;

      if (res.status == 201) {
        changeButtonState({
          ...buttonState,
          isLoading: false,
        });

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

          router.push('/admin/products');
        }, 1500);

        setProduct({
          ...product,
          name: '',
          price: '',
          description: '',
          type: 'dessert',
        });
        console.log('Product Data', data);
      }
    } catch (err) {
      type ServerError = {
        message: string;
      };
      // *** Axios error catch
      if (axios.isAxiosError(err)) {
        const serverError = err as AxiosError<ServerError>;
        if (serverError && serverError.response) {
          console.log('server error data', serverError.response.data);
          const { message } = serverError.response.data;

          if (message) {
            changeButtonState({
              ...buttonState,
              isLoading: false,
            });

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

  return (
    <>
      <Navbar pageTitle="Create Product" pageDescription="Create new product by admin" user={props.user} currentPage={'Products'} />

      <main>
        <Container size={'container.md'} mb={'2rem'}>
          <Box as={'div'} mt={'2rem'} boxShadow={'var(--box-shadow)'} px={'3rem'} py={'1rem'}>
            <Heading as="h3" size={'md'}>
              New Product
            </Heading>

            <form style={{ marginTop: '1rem' }} ref={formRef}>
              {productImageSrc == '/' && (
                <Box as={'div'} position={'relative'} bg={'gray'} color={'white'} width={'100%'} height={'250px'} mb={'1rem'}>
                  <Flex justifyContent={'center'} alignItems={'center'} flexDirection={'column'} height={'100%'}>
                    <PhotoIcon width={'100px'} height={'100px'} />
                    <Text>No image insert</Text>
                  </Flex>
                </Box>
              )}

              {productImageSrc != '/' && (
                <Box as={'div'} position={'relative'} width={'100%'} height={'250px'} mb={'1rem'}>
                  <Image src={productImageSrc} fill sizes="auto" alt={product.name} />
                </Box>
              )}

              <InputGroup mb={'1rem'}>
                <InputLeftElement pointerEvents="none">
                  <ClipboardDocumentListIcon color={'var(--chakra-colors-gray-400)'} width={'20px'} height={'20px'} />
                </InputLeftElement>
                <Input type="text" placeholder="Product Name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} _focusVisible={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }} />
              </InputGroup>

              <InputGroup mb={'1rem'}>
                <InputLeftElement pointerEvents="none">
                  <CurrencyDollarIcon color={'var(--chakra-colors-gray-400)'} width={'20px'} height={'20px'} />
                </InputLeftElement>
                <Input
                  type="number"
                  placeholder="Product Price"
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      price: e.target.value,
                    })
                  }
                  onBlur={() => {
                    setProduct({
                      ...product,
                      price: parseFloat(product.price).toFixed(2),
                    });
                  }}
                  value={product.price}
                  _focusVisible={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }}
                />
              </InputGroup>

              <InputGroup mb={'1rem'}>
                <InputLeftElement pointerEvents="none">
                  <ChatBubbleOvalLeftEllipsisIcon color={'var(--chakra-colors-gray-400)'} width={'20px'} height={'20px'} />
                </InputLeftElement>
                <Input type="text" placeholder="Product Description" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} _focusVisible={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }} />
              </InputGroup>

              <Divider border={'1px'} color={'gray.500'} opacity={1} mb={'1rem'} />

              <Box as={'div'} color={'gray.500'} mb={'1rem'}>
                <Flex gap={'0.5rem'} alignItems={'center'}>
                  <ChartPieIcon width={'20px'} height={'20px'} />
                  <Text>Product Type</Text>
                </Flex>

                <RadioGroup ml={'1rem'} mt={'0.3rem'} colorScheme={'brand'} onChange={(value) => setProduct({ ...product, type: value })} value={product.type}>
                  <Radio mr={'1rem'} value={'cake'}>
                    Cake
                  </Radio>
                  <Radio mr={'1rem'} value={'dessert'}>
                    Dessert
                  </Radio>
                  <Radio mr={'1rem'} value={'beverage'}>
                    Beverage
                  </Radio>
                </RadioGroup>
              </Box>

              <Divider border={'1px'} color={'gray.500'} opacity={1} mb={'1rem'} />

              <Box as={'div'} color={'gray.500'} mb={'1rem'}>
                <Flex gap={'0.5rem'} alignItems={'center'}>
                  <PhotoIcon width={'20px'} height={'20px'} />
                  <Text>Product Image</Text>
                </Flex>

                <input type={'file'} accept={'.jpg, .jpeg, .png'} placeholder="Basic usage" onChange={setImage} />
              </Box>

              <Divider border={'1px'} color={'gray.500'} opacity={1} mb={'1rem'} />

              <Box as="div" textAlign={'center'}>
                <Button colorScheme={'brand'} isLoading={buttonState.isLoading} isDisabled={buttonState.isDisabled} onClick={handleConfirmation}>
                  Create Product
                </Button>
              </Box>
            </form>
          </Box>
        </Container>
      </main>

      {alertOn.trigger && (
        <Alert status={alertOn.status} w="30vw" mx="auto" position={'fixed'} left={'50vw'} bottom={'2rem'} transform={'translateX(-50%)'}>
          <AlertIcon />
          {alertOn.message}
        </Alert>
      )}

      <Modal isOpen={modalState.isOpen} onClose={modalState.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={'brand.500'}>Confirm</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Box as="div" mb={'0.5rem'}>
              By submit this form,{' '}
              <Box as="span" fontWeight={'bold'}>
                email
              </Box>{' '}
              will be send to customer to{' '}
              <Box as="span" fontWeight={'bold'}>
                notify the new product
              </Box>
              .{' '}
            </Box>
            <Box as="div">Are you confirm to create this product?</Box>
          </ModalBody>

          <ModalFooter>
            <Button mx={2} colorScheme={'brand'} width={'5rem'} variant={'outline'} onClick={modalState.onClose}>
              Cancel
            </Button>

            <Button isLoading={submitButton.isLoading} colorScheme={'brand'} width={'5rem'} onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateProduct;

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
      permanent: false,
    },
    props: {},
  };
}, ironSessionOptions);
