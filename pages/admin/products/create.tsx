import { Box, Text, Container, Divider, Heading, Input, InputGroup, InputLeftElement, Select, RadioGroup, Radio } from '@chakra-ui/react';
import { ChatBubbleOvalLeftEllipsisIcon, ClipboardDocumentListIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import { ironSessionOptions } from '../../../lib/helper';

const CreateProduct = (props: any) => {
  const [radValue, setRadValue] = useState('dessert');

  return (
    <>
      <Navbar pageTitle="Create Product" pageDescription="Create new product by admin" user={props.user} currentPage={'Products'} />

      <main>
        <Container size={'container.md'}>
          <Box as={'div'} mt={'2rem'} boxShadow={'0 8px 24px rgb(0 0 0 / 30%)'} px={'3rem'} py={'1rem'}>
            <Heading as="h3" size={'md'}>
              New Product
            </Heading>

            <Box as="div" mt={'1rem'}>
              <InputGroup mb={'1rem'}>
                <InputLeftElement pointerEvents="none" children={<ClipboardDocumentListIcon color={'var(--chakra-colors-gray-400)'} width={'20px'} height={'20px'} />} />
                <Input type="text" placeholder="Product Name" _focusVisible={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }} />
              </InputGroup>

              <InputGroup mb={'1rem'}>
                <InputLeftElement pointerEvents="none" children={<CurrencyDollarIcon color={'var(--chakra-colors-gray-400)'} width={'20px'} height={'20px'} />} />
                <Input type="number" placeholder="Product Price" _focusVisible={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }} />
              </InputGroup>

              <InputGroup mb={'1rem'}>
                <InputLeftElement pointerEvents="none" children={<ChatBubbleOvalLeftEllipsisIcon color={'var(--chakra-colors-gray-400)'} width={'20px'} height={'20px'} />} />
                <Input type="text" placeholder="Product Description" _focusVisible={{ borderColor: 'brand.400', boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)' }} />
              </InputGroup>

              <Divider border={'1px'} color={'gray.500'} opacity={1} mb={'1rem'} />

              <Box as={'div'} color={'gray.500'}>
                <Text>Product Type</Text>
                <RadioGroup ml={'1rem'} mt={'0.3rem'} colorScheme={'brand'} onChange={(value) => setRadValue(value)} value={radValue}>
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
            </Box>
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
