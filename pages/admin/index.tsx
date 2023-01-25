import { Box, Container, Flex, Grid, GridItem } from '@chakra-ui/react';
import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { ironSessionOptions } from '../../lib/helper';

const Home = (props: any) => {
  const [salesData, setSalesData] = useState<{
    top_product: Array<any>;
    top_customer: Array<any>;
    total_product: number;
    total_product_sold: number;
    total_sales: string;
  }>();

  const callSalesApi = async () => {
    const url = '/api/v1/dashboard';

    try {
      const res = await axios.get(url);
      const { data } = res;

      if (data != undefined) {
        setSalesData(data);
        return;
      }

      setSalesData(undefined);
    } catch (err) {
      console.log('Error in callSalesApi', err);
    }
  };

  useEffect(() => {
    callSalesApi();
  }, []);

  return (
    <>
      <Navbar pageTitle="Admin Home" pageDescription="Homepage for admin" user={props.user} currentPage={'Home'} />

      <main>
        <Container maxW={'container.lg'} my={'2rem'}>
          {salesData && (
            <>
              <Grid gridTemplateColumns={'1fr 1fr'} gap={'3rem'} mb={'3rem'}>
                <Box as="div">
                  <Box as="div" fontWeight={'bold'} fontSize={'1.2rem'} mb={'0.5rem'}>
                    Top Product
                  </Box>

                  <Box as="div" p={'0.5rem 1rem'} borderWidth={'2px'} borderRadius={'10px'}>
                    <Grid gridTemplateColumns={'1fr 3fr 3fr'} textAlign="center" fontWeight={'bold'} mb="0.3rem">
                      <GridItem>No</GridItem>
                      <GridItem>Product Name</GridItem>
                      <GridItem>Total Sold (Qty)</GridItem>
                    </Grid>

                    {salesData.top_product.map((product, i) => (
                      <Grid key={i} gridTemplateColumns={'1fr 3fr 3fr'} textAlign="center">
                        <GridItem>{i + 1}</GridItem>
                        <GridItem textAlign={'left'}>{product.product_name}</GridItem>
                        <GridItem>{product.total_sold}</GridItem>
                      </Grid>
                    ))}
                  </Box>
                </Box>

                <Box as="div">
                  <Box as="div" fontWeight={'bold'} fontSize={'1.2rem'} mb={'0.5rem'}>
                    Top Customer
                  </Box>

                  <Box as="div" p={'0.5rem 1rem'} borderWidth={'2px'} borderRadius={'10px'}>
                    <Grid gridTemplateColumns={'1fr 3fr 3fr'} textAlign="center" fontWeight={'bold'} mb="0.3rem">
                      <GridItem>No</GridItem>
                      <GridItem>Product Name</GridItem>
                      <GridItem>Total Spend (RM)</GridItem>
                    </Grid>

                    {salesData.top_customer.map((customer, i) => (
                      <Grid key={i} gridTemplateColumns={'1fr 3fr 3fr'} textAlign="center">
                        <GridItem>{i + 1}</GridItem>
                        <GridItem textAlign={'left'}>{customer.customer_name}</GridItem>
                        <GridItem>{customer.total_spend}</GridItem>
                      </Grid>
                    ))}
                  </Box>
                </Box>
              </Grid>
              <Grid gridTemplateColumns={'1fr 1fr 1fr'} gap={'3rem'}>
                <Box as="div">
                  <Box as="div" fontWeight={'bold'} fontSize={'1.2rem'} mb={'0.5rem'}>
                    Total Product
                  </Box>

                  <Flex borderWidth={'2px'} borderRadius="10px" alignItems={'center'} justifyContent={'center'} width={'max-content'} px={'4rem'}>
                    <Box as="span" fontSize={'5rem'}>
                      {salesData.total_product}
                    </Box>
                    <Box as="span">qty</Box>
                  </Flex>
                </Box>

                <Box as="div">
                  <Box as="div" fontWeight={'bold'} fontSize={'1.2rem'} mb={'0.5rem'}>
                    Total Product Sold
                  </Box>

                  <Flex borderWidth={'2px'} borderRadius="10px" alignItems={'center'} justifyContent={'center'} width={'max-content'} px={'4rem'}>
                    <Box as="span" fontSize={'5rem'}>
                      {salesData.total_product_sold}
                    </Box>
                    <Box as="span">qty</Box>
                  </Flex>
                </Box>

                <Box as="div">
                  <Box as="div" fontWeight={'bold'} fontSize={'1.2rem'} mb={'0.5rem'}>
                    Total Sales
                  </Box>

                  <Flex borderWidth={'2px'} borderRadius="10px" alignItems={'center'} justifyContent={'center'} width={'max-content'} px={'4rem'}>
                    <Box as="span">RM</Box>
                    <Box as="span" fontSize={'5rem'}>
                      {salesData.total_sales}
                    </Box>
                  </Flex>
                </Box>
              </Grid>
            </>
          )}
        </Container>
      </main>
    </>
  );
};

export default Home;

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
