import { Box, Button, Container, Flex, Grid, GridItem } from '@chakra-ui/react';
import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { ironSessionOptions } from '../lib/helper';

const Order = (props: any) => {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    admin: boolean;
  }>();

  const [orders, setOrders] = useState<Array<any>>();

  const callCustomerOrderApi = async () => {
    const url = `/api/v1/order`;

    try {
      const res = await axios.get(url);
      const { message, data }: any = await res.data;

      if (message == 'You do not have order yet' || data.length == 0) {
        setOrders(undefined);
        return;
      }

      setOrders(data);
    } catch (err) {
      console.log(err);
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

    callCustomerOrderApi();
  }, []);

  return (
    <>
      {user ? <Navbar pageTitle="View Order" pageDescription="This is page that display all order by customer" currentPage={'View Order'} user={user} /> : <Navbar pageTitle="List of Products" pageDescription="This is page that display all available products" currentPage="View Cart" />}

      <main>
        <Container maxW={'container.lg'}>
          <Box my={'2rem'}>
            <Box as="h1" fontSize={'1.5rem'} fontWeight={'bold'} mb={'1rem'}>
              My Order
            </Box>

            {!orders && (
              <Box as="div" textAlign={'center'}>
                No orders found.
              </Box>
            )}

            {orders && (
              <Grid gap={'1rem'} gridTemplateColumns={['1fr', 'repeat(2, 1fr)']}>
                {orders.map((order, i) => {
                  const orderStatus = order.order_status.split('_').map((temp: any) => {
                    return `${temp.charAt(0).toUpperCase()}${temp.slice(1)} `;
                  });
                  const orderId = order.order_id.toString().padStart(4, '0');
                  const totalPrice = order.payment_total;

                  let dateCheckout;
                  let datePayment;
                  if (order.payment_created) {
                    const temp: Date = new Date(parseInt(order.payment_created) * 1000);
                    dateCheckout = `${temp.getDate().toString().padStart(2, '0')}-${(temp.getMonth() + 1).toString().padStart(2, '0')}-${temp.getFullYear()}`;
                  }
                  if (order.payment_date) {
                    const temp: Date = new Date(parseInt(order.payment_date) * 1000);
                    datePayment = `${temp.getDate().toString().padStart(2, '0')}-${(temp.getMonth() + 1).toString().padStart(2, '0')}-${temp.getFullYear()}`;
                  }

                  return (
                    <GridItem key={i} px={'1rem'} py={'1rem'} bg={'gray.100'} h={'min-content'}>
                      <Box as="h1" mb={'0.5rem'}>
                        <Flex alignItems={'center'} justifyContent={'space-between'}>
                          <Box as="div" fontWeight={'bold'} w={'11.5rem'}>
                            <Flex gap={'0.3rem'} justifyContent={'space-between'}>
                              <Box as="span">Order Id: </Box>
                              <Box as="span" color={'gray.500'}>
                                <Box as="span">No. </Box>
                                <Box as="span" color={'gray.500'}>
                                  {orderId}
                                </Box>
                              </Box>
                            </Flex>
                          </Box>

                          <Box as="div">
                            <Flex alignItems={'center'}>
                              <Box as="span" display={'inline-block'} w={'0.8rem'} h={'0.8rem'} bg={order.order_status == 'complete' ? 'green.500' : order.order_status == 'preparing' ? 'orange.400' : 'red.500'} borderRadius={'50%'}></Box>
                              <Box as="span" ml={'0.3rem'} fontWeight={'bold'} color={'gray.700'}>
                                {orderStatus}
                              </Box>
                            </Flex>
                          </Box>
                        </Flex>
                      </Box>

                      <Flex mb={'0.5rem'} justifyContent={'space-between'} alignItems={'center'}>
                        <Box as="div" fontSize={'0.9rem'} fontWeight={'bold'}>
                          <Flex gap={'0.3rem'} justifyContent={'space-between'} w={'11.5rem'}>
                            <Box as="span">Checkout At: </Box>
                            <Box as="span" color={'gray.500'}>
                              {dateCheckout}
                            </Box>
                          </Flex>
                          {order.payment_date && (
                            <Flex gap={'0.3rem'} justifyContent={'space-between'} w={'11.5rem'}>
                              <Box as="span">Pay At: </Box>
                              <Box as="span" color={'gray.500'}>
                                {datePayment}
                              </Box>
                            </Flex>
                          )}
                        </Box>
                        <Flex gap={'0.5rem'} fontWeight={'bold'}>
                          <Box as="span">Total:</Box>
                          <Box as="span" color={'gray.500'}>
                            RM {parseFloat(totalPrice).toFixed(2)}
                          </Box>
                        </Flex>
                      </Flex>

                      <Box as="div" bg={'white'} p={'0.5rem 1rem'}>
                        {order.cart_item.map((item: any, i: number) => (
                          <Grid key={i} gridTemplateColumns={'3fr repeat(2,1fr)'} gap={'0.5rem'}>
                            <GridItem>{item.product_name}</GridItem>
                            <GridItem>x</GridItem>
                            <GridItem textAlign={'center'}>{item.item_quantity}</GridItem>
                          </Grid>
                        ))}
                      </Box>

                      {order.order_status == 'awaiting_payment' && (
                        <Box as="div" mt={'1rem'} textAlign={'center'}>
                          <Button
                            colorScheme={'brand'}
                            onClick={() => {
                              router.push(`cart/checkout/${order.cart_id}`);
                            }}
                          >
                            Pay Now
                          </Button>
                        </Box>
                      )}

                      {order.order_status == 'preparing' && (
                        <Box as="div" mt={'1rem'} textAlign="center">
                          Your order will be process soon.
                        </Box>
                      )}

                      {order.order_status == 'complete' && (
                        <Box as="div" mt={'1rem'} textAlign="center">
                          Your order is complete.
                        </Box>
                      )}
                    </GridItem>
                  );
                })}
              </Grid>
            )}
          </Box>
        </Container>
      </main>
    </>
  );
};

export default Order;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({ req }) => {
  return {
    props: {
      user: req.session.user ? req.session.user : {},
    },
  };
}, ironSessionOptions);
