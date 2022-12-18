import { Alert, AlertIcon, Box, Button, Container, Divider, Flex, Input, InputGroup, InputLeftElement, Radio, RadioGroup, Text } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../../../../components/Navbar';
import { ironSessionOptions } from '../../../../lib/helper';
import Image from 'next/image';
import { ChartPieIcon, ChatBubbleOvalLeftEllipsisIcon, ClipboardDocumentListIcon, CurrencyDollarIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const EditProduct = (props: any) => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState<any>();
  const [productImageSrc, setProductImageSrc] = useState('#');
  const [productImageObj, setProductImageObj] = useState<undefined>();

  const [buttonState, setButtonState] = useState({
    isDisabled: false,
    isLoading: false,
  });
  const [alertOn, setAlertOn] = useState({
    status: undefined as 'success' | 'info' | 'warning' | 'error' | 'loading' | undefined,
    trigger: false,
    message: 'Alert',
  });

  useEffect(() => {
    const callAPI = async () => {
      const res = await axios.get(`/api/v1/products/${id}`);
      const { data } = res.data;

      if (data) {
        setProduct({
          ...data,
        });
        setProductImageSrc(data.product_image_path);
      }
    };

    callAPI();
  }, []);

  useEffect(() => {
    if (!product) {
      return;
    }
    if (product.product_name == '' || product.product_price == '' || product.product_description == '' || product.product_type == '') {
      setButtonState({
        ...buttonState,
        isDisabled: true,
      });
      return;
    }

    setButtonState({
      ...buttonState,
      isDisabled: false,
    });
  }, [product]);

  const setImage = (e: any) => {
    // @ts-ignore
    if (e.target.files.length > 0) {
      let reader = new FileReader();

      reader.onload = (e) => {
        // @ts-ignore
        setProductImageSrc(e.target.result);
      };

      reader.readAsDataURL(e.target.files[0]);
      setProductImageObj(e.target.files[0]);
      return;
    }

    setProductImageSrc(product.product_image_path);
    setProductImageObj(undefined);
  };

  const handleUpdate = async () => {
    setButtonState({
      ...buttonState,
      isLoading: true,
    });

    const formData = new FormData();
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const url = `/api/v1/products/${id}`;

    if (product.product_name == '' || product.product_description == '' || product.product_price == '' || product.product_type == '') {
      return;
    }

    formData.append('name', product.product_name);
    formData.append('description', product.product_description);
    formData.append('type', product.product_type);
    formData.append('price', product.product_price);

    if (productImageObj != undefined) {
      formData.append('image', productImageObj);
    }

    try {
      const res = await axios.patch(url, formData, config);

      const { message, data } = res.data;

      if (res.status >= 200 && res.status < 300) {
        setButtonState({
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
        }, 2500);

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
            setButtonState({
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
      <Navbar pageTitle="Edit Product" pageDescription="Edit Product page" user={props.user} currentPage={'Products'} />

      <main>
        <Container size={'container.md'}>
          {product && (
            <Box as={'form'} my={'2rem'} boxShadow={'var(--box-shadow)'} px={'3rem'} py={'1rem'} borderRadius={'5px'}>
              <Box as={'div'} position={'relative'} width={'100%'} height={'250px'} mb={'1rem'}>
                <Image src={productImageSrc} fill sizes="auto" alt={product.product_name} />
              </Box>

              <InputGroup mb={'1rem'}>
                <InputLeftElement pointerEvents="none" children={<ClipboardDocumentListIcon color={'var(--chakra-colors-gray-400)'} width={'20px'} height={'20px'} />} />
                <Input type="text" placeholder="Product Name" value={product.product_name} onChange={(e) => setProduct({ ...product, product_name: e.target.value })} _focusVisible={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }} />
              </InputGroup>

              <InputGroup mb={'1rem'}>
                <InputLeftElement pointerEvents="none" children={<CurrencyDollarIcon color={'var(--chakra-colors-gray-400)'} width={'20px'} height={'20px'} />} />
                <Input
                  type="number"
                  placeholder="Product Price"
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      product_price: e.target.value,
                    })
                  }
                  onBlur={() => {
                    setProduct({
                      ...product,
                      product_price: parseFloat(product.product_price).toFixed(2),
                    });
                  }}
                  value={product.product_price}
                  _focusVisible={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }}
                />
              </InputGroup>

              <InputGroup mb={'1rem'}>
                <InputLeftElement pointerEvents="none" children={<ChatBubbleOvalLeftEllipsisIcon color={'var(--chakra-colors-gray-400)'} width={'20px'} height={'20px'} />} />
                <Input type="text" placeholder="Product Description" value={product.product_description} onChange={(e) => setProduct({ ...product, product_description: e.target.value })} _focusVisible={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }} />
              </InputGroup>

              <Divider border={'1px'} color={'gray.500'} opacity={1} mb={'1rem'} />

              <Box as={'div'} color={'gray.500'} mb={'1rem'}>
                <Flex gap={'0.5rem'} alignItems={'center'}>
                  <ChartPieIcon width={'20px'} height={'20px'} />
                  <Text>Product Type</Text>
                </Flex>

                <RadioGroup ml={'1rem'} mt={'0.3rem'} colorScheme={'brand'} onChange={(value) => setProduct({ ...product, product_type: value })} value={product.product_type}>
                  <Radio mr={'1rem'} value={'dessert'}>
                    Dessert
                  </Radio>
                  <Radio mr={'1rem'} value={'beverage'}>
                    Beverage
                  </Radio>
                  <Radio mr={'1rem'} value={'bread'}>
                    Bread
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

              <Flex gap={2} alignItems={'center'} justifyContent={'space-evenly'} position={'relative'}>
                <Button colorScheme={'brand'} width={'100%'} isLoading={buttonState.isLoading} isDisabled={buttonState.isDisabled} onClick={handleUpdate}>
                  Update
                </Button>
                <Box as={'div'} width={'100%'}>
                  <Link href={'/admin/products'}>
                    <Button colorScheme={'brand'} width={'100%'} variant={'outline'}>
                      Back
                    </Button>
                  </Link>
                </Box>
              </Flex>
            </Box>
          )}
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

export default EditProduct;

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
