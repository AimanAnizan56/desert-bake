import { Box, Button, Container, Divider, Flex, Grid, GridItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
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
  const [pageLoad, setPageLoad] = useState(true);

  const [carts, setCarts] = useState<Array<any>>();
  const [itemDetail, setItemDetail] = useState({
    totalQuantity: 0,
    totalPrice: 0,
    cartId: undefined,
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    onClose: () => {
      console.log('closing modal');
      setModalState({ ...modalState, isOpen: false });
    },
  });

  const addQuantity = async (e: any) => {
    // add quantity
    e.preventDefault();
    const { productId } = e.target.dataset;
    console.log('productId', productId);
    const url = '/api/v1/cart/add';

    try {
      const res: any = await axios.post(url, {
        product_id: productId,
      });

      const { message } = res.data;

      if (res.status == 200 && message == 'Successfully add to cart') {
        // call api
        getCustomerCartAPI();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeQuantity = async (e: any) => {
    // remove quantity
    e.preventDefault();
    const { productId } = e.target.dataset;
    console.log('productId', productId);
    const url = '/api/v1/cart/remove';

    try {
      const res: any = await axios.post(url, {
        product_id: productId,
      });

      const { message } = res.data;

      if (res.status == 200 && message == 'Successfully remove from cart') {
        // call api
        getCustomerCartAPI();
      }
    } catch (err) {
      console.error(err);
    }
  };

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

  const handleCheckout = () => {
    // to popup modal for confirmation
    setModalState({
      ...modalState,
      isOpen: true,
    });
  };

  const performCheckout = async () => {
    // to change cart status
    // if succeed - redirect checkout page
    const url = `/api/v1/cart/status/${itemDetail.cartId}`;

    try {
      let res: any = await axios.put(url, {
        status: 'complete',
      });
      const { message } = res.data;

      if (res.status == 200 && message == 'Cart status updated') {
        res = await axios.post('/api/v1/order', {
          cart_id: itemDetail.cartId,
        });

        if (res.status == 200 && res.data.message == 'Order successfully created') {
          router.push(`/cart/checkout/${itemDetail.cartId}`);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCustomerCartAPI = async () => {
    const url = '/api/v1/cart';

    try {
      const res: any = await axios.get(url);
      const { message, user_cart, cart_id } = await res.data;
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
          cartId: cart_id,
        });
        setCarts(user_cart);
      } else {
        setCarts(undefined);
      }
      setPageLoad(false);
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
      {user ? <Navbar pageTitle="View Cart" pageDescription="This is page that display all available products" currentPage={'View Cart'} user={user} /> : <Navbar pageTitle="List of Products" pageDescription="This is page that display all available products" currentPage="View Cart" />}

      <main>
        <Container maxW={'container.lg'}>
          <Box my={'2rem'}>
            <Box as="h1" fontSize={'1.5rem'} fontWeight={'bold'} mb={'1rem'}>
              My Cart
            </Box>

            {!pageLoad && !carts && (
              <Box as="div" textAlign={'center'}>
                Your cart is currently empty.
              </Box>
            )}

            {carts && (
              <>
                <Box as="div" bg="brand.400" color={'white'}>
                  <Grid py={'0.5rem'} px={'1rem'} gridTemplateColumns="3fr 2fr 1fr">
                    <GridItem>Product</GridItem>
                    <GridItem>
                      <Box as="div" textAlign={'center'}>
                        Quantity
                      </Box>
                    </GridItem>
                    <GridItem>Subtotal</GridItem>
                  </Grid>
                </Box>
                <Flex flexDirection={'column'} gap={3} my={'0.5rem'}>
                  {carts.map((cart, i) => (
                    <Grid py={'0.5rem'} px={'1rem'} gridTemplateColumns="3fr 2fr 1fr" key={i}>
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
                      <GridItem>
                        <Flex gap={5} flexDirection="row" alignItems="center" justifyContent={'center'}>
                          <Box as="button" color={'white'} bg={'brand.400'} w={'1.5rem'} h={'1.5rem'} data-product-id={cart.product_id} onClick={removeQuantity}>
                            -
                          </Box>
                          <Box as="span" w={'1.5rem'} textAlign={'center'}>
                            {cart.item_quantity}
                          </Box>
                          <Box as="button" color={'white'} bg={'brand.400'} w={'1.5rem'} h={'1.5rem'} data-product-id={cart.product_id} onClick={addQuantity}>
                            +
                          </Box>
                        </Flex>
                      </GridItem>
                      <GridItem>RM {(parseInt(cart.item_quantity) * parseFloat(cart.item_price)).toFixed(2)}</GridItem>
                    </Grid>
                  ))}

                  <Divider borderBottomWidth={'0.2rem'} />

                  <Grid py={'0.5rem'} px={'1rem'} gridTemplateColumns="3fr 2fr 1fr" fontWeight={'bold'}>
                    <GridItem></GridItem>
                    <GridItem>
                      <Box as="div" textAlign={'center'}>
                        {itemDetail.totalQuantity}
                      </Box>
                    </GridItem>
                    <GridItem>Total: RM {itemDetail.totalPrice.toFixed(2)}</GridItem>
                  </Grid>

                  <Divider borderBottomWidth={'0.2rem'} />
                </Flex>
                <Box as="div" textAlign={'right'}>
                  <Button colorScheme={'brand'} onClick={handleCheckout}>
                    Checkout
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Container>

        <Modal isOpen={modalState.isOpen} onClose={modalState.onClose} isCentered>
          <ModalOverlay />
          <ModalContent maxW={'max-content'}>
            <ModalHeader>Checkout</ModalHeader>
            <ModalCloseButton />

            <ModalBody>Are you sure you want to proceed? </ModalBody>

            <ModalFooter>
              <Button mx={2} colorScheme={'green'} width={'5rem'} variant={'outline'} onClick={modalState.onClose}>
                No
              </Button>

              <Button colorScheme={'green'} width={'5rem'} onClick={performCheckout}>
                Yes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
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
