import { ChevronDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Alert, AlertIcon, Box, Button, Container, Flex, Grid, GridItem, Heading, Link, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { ironSessionOptions } from '../../lib/helper';
import Image from 'next/image';
import { SkeletonProductCustomerGrid } from '../../components/Skeleton.component';
import { useRouter } from 'next/router';

const Products = (props: any) => {
  const router = useRouter();
  const [products, setProducts] = useState<Array<any>>();
  const [filterProducts, setFilterProducts] = useState<Array<any>>();
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const [alertOn, setAlertOn] = useState({
    trigger: false,
    status: undefined as 'success' | 'info' | 'warning' | 'error' | 'loading' | undefined,
    message: '',
  });

  const [filter, setFilter] = useState<'All Products' | 'Cake' | 'Dessert' | 'Beverage'>('All Products');

  const filterHandler = (e: any) => {
    const { value } = e.target.dataset;
    setFilter(value);

    if (value.toLowerCase() == 'all products') {
      setFilterProducts(products);
      return;
    }

    const temp = products?.filter(({ product_type }) => {
      return product_type == value.toLowerCase();
    });
    setFilterProducts(temp);
  };

  const handleAddToCart = async (e: any) => {
    if (Object.keys(props.user).length == 0) {
      router.push({
        pathname: '/signin',
        query: {
          from: 'products',
        },
      });
      return;
    }

    const url = '/api/v1/cart/add';

    const { productId } = e.target.dataset;

    try {
      const res: any = await axios.post(url, {
        product_id: productId,
      });

      const { message } = res.data;

      console.log('res status', res.status);
      console.log('res messaege', message);

      if (res.status == 200 && message == 'Successfully add to cart') {
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
        }, 1500);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const callProductsAPI = async () => {
    const res = await axios.get('/api/v1/products');
    const { data } = res.data;

    if (data) {
      setSkeletonLoading(false);
      setProducts(data);
      setFilterProducts(data);
    }

    if (!data) {
      setSkeletonLoading(false);
    }
  };

  useEffect(() => {
    callProductsAPI();
  }, []);

  return (
    <>
      {props.user.id ? (
        <Navbar pageTitle="List of Products" pageDescription="This is page that display all available products" currentPage={'Products'} user={props.user} />
      ) : (
        <Navbar pageTitle="List of Products" pageDescription="This is page that display all available products" currentPage="Products" />
      )}

      <main>
        <Container maxW={'container.lg'}>
          <Box as="div" my={'2rem'}>
            <Flex alignItems={'center'} justifyContent="space-between">
              <Heading as="h1" fontSize={'1.5rem'}>
                {filter}
              </Heading>

              <Box as="div">
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme={'brand'} variant="outline">
                    Filter
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={filterHandler} data-value={'All Products'}>
                      All
                    </MenuItem>
                    <MenuItem onClick={filterHandler} data-value={'Cake'}>
                      Cake
                    </MenuItem>
                    <MenuItem onClick={filterHandler} data-value={'Dessert'}>
                      Dessert
                    </MenuItem>
                    <MenuItem onClick={filterHandler} data-value={'Beverage'}>
                      Beverage
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </Flex>

            <Grid mt={'1.5rem'} templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} gap={5}>
              {skeletonLoading && (
                <>
                  <SkeletonProductCustomerGrid />
                  <SkeletonProductCustomerGrid />
                  <SkeletonProductCustomerGrid />
                </>
              )}

              {!filterProducts && !skeletonLoading && <div>No product yet! Stay tuned.</div>}

              {filterProducts &&
                filterProducts!.map((product: any, i) => {
                  const { product_id, product_name, product_price, product_description, product_type, product_image_path } = product;

                  return (
                    <GridItem key={i} boxShadow={'var(--box-shadow)'} borderRadius={'5px'} px={'0.5rem'} py={'1rem'}>
                      <Flex flexDirection={'column'} height={'100%'} justifyContent={'space-between'}>
                        <Box as="div" mb={'0.5rem'} position={'relative'} width={'100%'} height={'200px'}>
                          <Image fill sizes="auto" src={product_image_path} alt={product_name} />
                        </Box>

                        <Flex alignItems={'center'} mb={'0.5rem'} justifyContent={'space-between'} gap={3}>
                          <Box as="div" fontWeight={'bold'}>
                            {product_name}
                          </Box>
                          <Box as="div" fontWeight={'bold'} width={'100px'} textAlign={'right'}>
                            RM {product_price}
                          </Box>
                        </Flex>

                        <Box as="div" mb={'1rem'} color={'gray.400'}>
                          {product_description}
                        </Box>

                        <Box as="div">
                          <Box as="div" mb={'0.5rem'}>
                            <Button colorScheme={'brand'} width={'100%'} data-product-id={product_id} onClick={handleAddToCart}>
                              Add to Cart
                            </Button>
                          </Box>
                        </Box>
                      </Flex>
                    </GridItem>
                  );
                })}

              {filterProducts && filterProducts.length == 0 && <div>No Product found with this type.</div>}
            </Grid>
          </Box>
        </Container>

        {alertOn.trigger && (
          <Alert status={alertOn.status} w="30vw" mx="auto" position={'fixed'} left={'50vw'} bottom={'2rem'} transform={'translateX(-50%)'}>
            <AlertIcon />
            {alertOn.message}
          </Alert>
        )}
      </main>
    </>
  );
};

export default Products;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({ req }) => {
  return {
    props: {
      user: req.session.user ? req.session.user : {},
    },
  };
}, ironSessionOptions);
