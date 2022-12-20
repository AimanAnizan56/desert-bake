import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Flex, Heading, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { ironSessionOptions } from '../../lib/helper';

const Products = (props: any) => {
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    admin: boolean;
  }>();

  const [filter, setFilter] = useState<'All Products' | 'Dessert' | 'Beverage' | 'Bread'>('All Products');

  const filterHandler = (e: any) => {
    setFilter(e.target.dataset.value);
  };

  useEffect(() => {
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
                    <MenuItem onClick={filterHandler} data-value={'All Product'}>
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
