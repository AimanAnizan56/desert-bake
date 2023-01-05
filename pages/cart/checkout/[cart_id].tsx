import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { ironSessionOptions } from '../../../lib/helper';
import axios from 'axios';
import { Box, Container, Divider, Flex, Grid } from '@chakra-ui/react';
import Payment from '../../../components/Payment';
import products from '../../api/v1/products';

const Checkout = (props: any) => {
  const router = useRouter();
  const { cart_id } = router.query;

  // use when retrieve cart detail in db if exist -- remove later
  const [cartId, setCartId] = useState();
  const [paymentId, setPaymentId] = useState();

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

  const getCustomerCartAPI = async () => {
    if (cart_id == undefined || cart_id == '') {
      return;
    }

    const url = `/api/v1/cart/complete/${cart_id}`;

    try {
      const res: any = await axios.get(url);
      const { message, data } = await res.data;

      if (res.status == 200 && message == 'Item retrieve') {
        setCarts(data);

        data.map((temp: any) => {
          setItemDetail({
            ...itemDetail,
            totalQuantity: itemDetail.totalQuantity + temp.item_quantity,
            totalPrice: temp.cart_total,
          });
        });
      } else {
        setCarts(undefined);
        setItemDetail({
          totalQuantity: 0,
          totalPrice: 0,
        });
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
      <main>
        <Container maxW={'container.lg'} my={'3rem'}>
          {carts && (
            <Grid gridTemplateColumns={'3fr 2fr'} gap={20}>
              <Box as="div">
                <Box as="div" borderRadius={'10px'} boxShadow={'var(--box-shadow)'} pt={'1.3rem'} pb={'2rem'} px={'2rem'}>
                  <Box as="h1" fontSize={'1.3rem'} mb={'0.5rem'} fontWeight={'bold'}>
                    Order Summary
                  </Box>

                  <Grid gap={2}>
                    {carts.map((cart, i) => {
                      return (
                        <Grid key={i} gridTemplateColumns={'6fr repeat(2,1fr)'} alignItems={'center'}>
                          <Flex gap={'0.1rem'} flexDirection={'column'}>
                            <Box as="span">{cart.product_name}</Box>
                            <Box as="span" color={'gray.400'}>
                              RM {cart.item_price}
                            </Box>
                          </Flex>

                          <Box as="span">×</Box>

                          <Box as="span" textAlign={'center'}>
                            {cart.item_quantity}
                          </Box>
                        </Grid>
                      );
                    })}

                    <Divider borderBottomWidth={'0.2rem'} />

                    <Grid gridTemplateColumns={'6fr 2fr'} alignItems={'center'} fontWeight={'bold'}>
                      <Box as="span">Total Price</Box>
                      <Box as="span" textAlign={'center'}>
                        RM {itemDetail.totalPrice}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              {cartId && <Box as="div">{/* <Payment /> */}</Box>}
            </Grid>
          )}
        </Container>
      </main>
    </>
  );
};

export default Checkout;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({ req }) => {
  return {
    props: {
      user: req.session.user ? req.session.user : {},
      clientSecret: {},
    },
  };
}, ironSessionOptions);
