import { Box, Text, Container, Divider, Heading, Input, InputGroup, InputLeftElement, RadioGroup, Radio, Flex, Button } from '@chakra-ui/react';
import { ChartPieIcon, ChatBubbleOvalLeftEllipsisIcon, ClipboardDocumentListIcon, CurrencyDollarIcon, PhotoIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { ironSessionOptions } from '../../../lib/helper';

const CreateProduct = (props: any) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    type: 'dessert',
    image: undefined,
  });
  const [buttonState, setButtonState] = useState({
    isLoading: false,
    isDisabled: true,
  });

  useEffect(() => {
    if (product.name.length > 0 && product.price.length > 0 && product.description.length > 0 && product.type.length > 0 && product.image != undefined) {
      setButtonState({ ...buttonState, isDisabled: false });
      return;
    }
    setButtonState({ ...buttonState, isDisabled: true });
  }, [product]);

  const setImage = (e: any) => {
    // @ts-ignore
    if (e.target.files.length > 0) {
      setProduct({ ...product, image: e.target.files[0] });
      return;
    }
    setProduct({ ...product, image: undefined });
  };

  const handleSubmit = async () => {
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
      const data = await axios.post(url, formData, config);
    } catch (err) {}
  };

  return (
    <>
      <Navbar pageTitle="Create Product" pageDescription="Create new product by admin" user={props.user} currentPage={'Products'} />

      <main>
        <Container size={'container.md'}>
          <Box as={'div'} mt={'2rem'} boxShadow={'0 8px 24px rgb(0 0 0 / 30%)'} px={'3rem'} py={'1rem'}>
            <Heading as="h3" size={'md'}>
              New Product
            </Heading>

            <form style={{ marginTop: '1rem' }} ref={formRef}>
              <InputGroup mb={'1rem'}>
                <InputLeftElement pointerEvents="none" children={<ClipboardDocumentListIcon color={'var(--chakra-colors-gray-400)'} width={'20px'} height={'20px'} />} />
                <Input type="text" placeholder="Product Name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} _focusVisible={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }} />
              </InputGroup>

              <InputGroup mb={'1rem'}>
                <InputLeftElement pointerEvents="none" children={<CurrencyDollarIcon color={'var(--chakra-colors-gray-400)'} width={'20px'} height={'20px'} />} />
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
                <InputLeftElement pointerEvents="none" children={<ChatBubbleOvalLeftEllipsisIcon color={'var(--chakra-colors-gray-400)'} width={'20px'} height={'20px'} />} />
                <Input type="text" placeholder="Product Description" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} _focusVisible={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }} />
              </InputGroup>

              <Divider border={'1px'} color={'gray.500'} opacity={1} mb={'1rem'} />

              <Box as={'div'} color={'gray.500'} mb={'1rem'}>
                <Flex gap={'0.5rem'} alignItems={'center'}>
                  <ChartPieIcon width={'20px'} height={'20px'} />
                  <Text>Product Type</Text>
                </Flex>

                <RadioGroup ml={'1rem'} mt={'0.3rem'} colorScheme={'brand'} onChange={(value) => setProduct({ ...product, type: value })} value={product.type}>
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

                <input type={'file'} accept={'image/*'} placeholder="Basic usage" onChange={setImage} />
              </Box>

              <Divider border={'1px'} color={'gray.500'} opacity={1} mb={'1rem'} />

              <Box as="div" textAlign={'center'}>
                <Button colorScheme={'brand'} isLoading={buttonState.isLoading} isDisabled={buttonState.isDisabled} onClick={handleSubmit}>
                  Create Product
                </Button>
              </Box>
            </form>
          </Box>
        </Container>
      </main>
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
