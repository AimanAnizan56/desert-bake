import { Box, Button, Container, Flex, Grid, GridItem, Heading, Skeleton, SkeletonText } from '@chakra-ui/react';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { ironSessionOptions } from '../../../lib/helper';
import { SkeletonProductGridItem } from '../../../components/Skeleton.component';
import axios from 'axios';
import Image from 'next/image';
import { EditIcon } from '@chakra-ui/icons';

const Products = (props: any) => {
  const [products, setProducts] = useState<Array<any>>();
  const [skeleton, setSkeleton] = useState(true);

  useEffect(() => {
    const callAPI = async () => {
      const res = await axios.get('/api/v1/products');
      const { data } = res.data;

      if (data) {
        setProducts(data);
        setSkeleton(false);
      }

      if (res.status == 204) {
        setSkeleton(false);
      }
    };

    callAPI();
  }, []);

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

          <Grid templateColumns={'repeat(3, 1fr)'} gap={5} my={'2.5rem'}>
            {skeleton && (
              <>
                <SkeletonProductGridItem />
                <SkeletonProductGridItem />
                <SkeletonProductGridItem />
              </>
            )}

            {!products && !skeleton && <Box as="div">No product found!</Box>}

            {products &&
              products.map((product, i) => {
                return (
                  <Fragment key={i}>
                    <GridItem boxShadow={'var(--box-shadow)'} borderRadius={'5px'} px={'0.5rem'} py={'1rem'}>
                      <Box as="div" mb={'0.5rem'} position={'relative'} width={'100%'} height={'150px'}>
                        <Image fill src={product.product_image_path} alt={product.product_id} />
                      </Box>
                      <Box as="div" fontWeight={'bold'}>
                        {product.product_name}
                      </Box>
                      <Box as="div" mb={'0.5rem'} fontWeight={'bold'} color={'gray.400'}>
                        RM {product.product_price}
                      </Box>
                      <Box as="div">
                        <Link href={`/admin/products/edit/${product.product_id}`}>
                          <Button leftIcon={<EditIcon />} colorScheme={'brand'} width={'100%'}>
                            Edit
                          </Button>
                        </Link>
                      </Box>
                    </GridItem>
                  </Fragment>
                );
              })}
          </Grid>
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
