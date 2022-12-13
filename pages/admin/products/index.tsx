import { Box, Button, Container, Flex, Heading } from '@chakra-ui/react';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { ironSessionOptions } from '../../../lib/helper';

const Products = (props: any) => {
  return (
    <>
      <Navbar pageTitle="Products" pageDescription="Product page" user={props.user} currentPage={'Products'} />

      <main>
        <Container maxW={'container.md'}>
          <Flex mt={'2rem'} justifyContent={'space-between'} alignItems={'center'}>
            <Heading as="h1" size={'lg'} color={'brand.400'}>
              Products
            </Heading>

            <Box as="div">
              <Button size={'sm'} colorScheme={'whatsapp'}>
                <Link href={'/admin/products/create'}>+ Add Product</Link>
              </Button>
            </Box>
          </Flex>
        </Container>
      </main>
    </>
  );
};

export default Products;

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
