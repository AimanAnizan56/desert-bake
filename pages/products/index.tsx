import { ChevronDownIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Flex, Grid, GridItem, Heading, Link, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { ironSessionOptions } from '../../lib/helper';
import Image from 'next/image';
import { SkeletonProductCustomerGrid } from '../../components/Skeleton.component';

const Products = (props: any) => {
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    admin: boolean;
  }>();
  const [products, setProducts] = useState<Array<any>>();
  const [filterProducts, setFilterProducts] = useState<Array<any>>();
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  const [filter, setFilter] = useState<'All Products' | 'Dessert' | 'Beverage' | 'Bread'>('All Products');

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
    if (Object.keys(props.user).length != 0) {
      setUser({
        ...props.user,
      });
    }
  }, []);

  return (
    <>
      {user ? <Navbar pageTitle="List of Products" pageDescription="This is page that display all available products" currentPage={'Products'} user={user} /> : <Navbar pageTitle="List of Products" pageDescription="This is page that display all available products" currentPage="Products" />}

      <main>
        <Container maxW={'container.lg'}>
          <Box as="div" mt={'2rem'}>
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
                    <MenuItem onClick={filterHandler} data-value={'Dessert'}>
                      Dessert
                    </MenuItem>
                    <MenuItem onClick={filterHandler} data-value={'Beverage'}>
                      Beverage
                    </MenuItem>
                    <MenuItem onClick={filterHandler} data-value={'Bread'}>
                      Bread
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </Flex>

            <Grid mt={'1.5rem'} templateColumns={'repeat(3, 1fr)'} gap={5}>
              {skeletonLoading && (
                <>
                  <SkeletonProductCustomerGrid />
                  <SkeletonProductCustomerGrid />
                  <SkeletonProductCustomerGrid />
                </>
              )}

              {!filterProducts && !skeletonLoading && <div>No product yet! Stay tuned.</div>}

              {filterProducts &&
                filterProducts!.map((product, i) => {
                  return (
                    <GridItem key={i} boxShadow={'var(--box-shadow)'} borderRadius={'5px'} px={'0.5rem'} py={'1rem'}>
                      <Box as="div" mb={'0.5rem'} position={'relative'} width={'100%'} height={'200px'}>
                        <Image fill sizes="auto" src={product.product_image_path} alt={product.product_id} />
                      </Box>

                      <Flex alignItems={'center'} mb={'0.5rem'} justifyContent={'space-between'} gap={3}>
                        <Box as="div" fontWeight={'bold'}>
                          {product.product_name}
                        </Box>
                        <Box as="div" fontWeight={'bold'} width={'100px'} textAlign={'right'}>
                          RM {product.product_price}
                        </Box>
                      </Flex>

                      <Box as="div" mb={'1rem'} color={'gray.400'}>
                        {product.product_description}
                      </Box>

                      <Box as="div">
                        <Box as="div" mb={'0.5rem'}>
                          <Button colorScheme={'brand'} width={'100%'}>
                            Add to Cart
                          </Button>
                        </Box>
                      </Box>
                    </GridItem>
                  );
                })}

              {filterProducts && filterProducts.length == 0 && <div>No Product found with this type.</div>}
            </Grid>
          </Box>
        </Container>
      </main>

      <footer>footer </footer>
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
