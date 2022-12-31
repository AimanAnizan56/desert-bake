import { Box, Container, Flex, Grid, GridItem } from '@chakra-ui/react';
import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
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
  const [itemDetail, setItemDetail] = useState({
    totalQuantity: 0,
    totalPrice: 0,
  });

  const removeItemHandler = async (e: any) => {
    e.preventDefault();
    const { itemId } = e.target.dataset;

    try {
      const res = await axios.delete(`/api/v1/cart/remove/${itemId}`);
      const { message } = res.data;

      if (res.status == 200 && message == 'Item id deleted successfully') {
        getCustomerCartAPI();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCustomerCartAPI = async () => {
    const url = '/api/v1/cart';

    try {
      const res: any = await axios.get(url);
      const { message, user_cart } = await res.data;
      let temp = {
        totalPrice: 0,
        totalQuantity: 0,
      };

      if (message == 'Cart retrieve' && user_cart) {
        user_cart.map((uc: any, i: any) => {
          temp.totalQuantity += uc.item_quantity;
          temp.totalPrice += uc.item_quantity * parseFloat(uc.item_price);
        });

        setItemDetail({
          ...itemDetail,
          totalQuantity: temp.totalQuantity,
          totalPrice: temp.totalPrice,
        });
        setCarts(user_cart);
      } else {
        setCarts(undefined);
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
                <Box as="div" bg="brand.400" color={'white'}>
                  <Grid py={'0.5rem'} px={'1rem'} gridTemplateColumns="3fr repeat(2,1fr)">
                    <GridItem>Product</GridItem>
                    <GridItem>Quantity</GridItem>
                    <GridItem>Subtotal</GridItem>
                  </Grid>
                </Box>
                <Flex flexDirection={'column'} gap={3} my={'0.5rem'}>
                  {carts.map((cart, i) => (
                    <Grid py={'0.5rem'} px={'1rem'} gridTemplateColumns="3fr repeat(2,1fr)" key={i}>
                      <GridItem>
                        <Flex gap={3}>
                          <Box as="div" position={'relative'} w="10vw" h="15vh">
                            <Image src={cart.product_image_path} fill alt={cart.product_name} />
                          </Box>
                          <Box as="div" py="0.3rem">
                            <Box as="div" fontWeight={'bold'}>
                              {cart.product_name}
                            </Box>
                            <Box as="div" color={'gray.400'}>
                              Price: RM {cart.item_price}
                            </Box>
                            <Box as="button" color="red.400" data-item-id={cart.item_id} onClick={removeItemHandler}>
                              Remove
                            </Box>
                          </Box>
                        </Flex>
                      </GridItem>
                      <GridItem>{cart.item_quantity}</GridItem>
                      <GridItem>RM {(parseInt(cart.item_quantity) * parseFloat(cart.item_price)).toFixed(2)}</GridItem>
                    </Grid>
                  ))}

                  <Grid py={'0.5rem'} px={'1rem'} gridTemplateColumns="3fr repeat(2,1fr)" fontWeight={'bold'}>
                    <GridItem></GridItem>
                    <GridItem>{itemDetail.totalQuantity}</GridItem>
                    <GridItem>Total: RM {itemDetail.totalPrice.toFixed(2)}</GridItem>
                  </Grid>
                </Flex>
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
