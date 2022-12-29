import { Box, Container } from '@chakra-ui/react';
import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { ironSessionOptions } from '../lib/helper';

const Cart = (props: any) => {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    admin: boolean;
  }>();
  const [carts, setCarts] = useState<Array<any>>();

  const getCustomerCartAPI = async () => {
    const url = '/api/v1/cart';

    try {
      const res: any = await axios.get(url);
      const { message, user_cart } = await res.data;

      if (message == 'Cart retrieve' && user_cart) {
        setCarts(user_cart);
      }
    } catch (err) {
      console.log('err getCustomerCart', err);
    }
  };

  useEffect(() => {
    if (Object.keys(props.user).length != 0) {
      setUser({
        ...props.user,
      });
    } else {
      router.push('/signin');
      return;
    }

    getCustomerCartAPI();
  }, []);

  return (
    <>
      {user ? <Navbar pageTitle="List of Products" pageDescription="This is page that display all available products" currentPage={'View Cart'} user={user} /> : <Navbar pageTitle="List of Products" pageDescription="This is page that display all available products" currentPage="View Cart" />}

      <main>
        <Container maxW={'container.lg'}>
          <Box my={'2rem'}>
            <Box as="h1" fontSize={'1.5rem'} fontWeight={'bold'} mb={'1rem'}>
              My Cart
            </Box>

            {!carts && (
              <Box as="div" textAlign={'center'}>
                Your cart is currently empty.
              </Box>
            )}

            {carts && (
              <>
                <div>Cart ada</div>
                {carts.map((cart, i) => (
                  <Box as={'div'} key={i} my={'1rem'}>
                    <div>Product name: {cart.product_name}</div>
                  </Box>
                ))}
              </>
            )}
          </Box>
        </Container>
      </main>
    </>
  );
};

export default Cart;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({ req }) => {
  return {
    props: {
      user: req.session.user ? req.session.user : {},
    },
  };
}, ironSessionOptions);
