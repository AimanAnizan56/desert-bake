import { Container } from '@chakra-ui/react';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { ironSessionOptions } from '../lib/helper';

const Cart = (props: any) => {
  const [user, setUser] = useState<{
    id: number;
    name: string;
    email: string;
    admin: boolean;
  }>();

  useEffect(() => {
    if (Object.keys(props.user).length != 0) {
      setUser({
        ...props.user,
      });
    }
  }, []);

  return (
    <>
      {user ? <Navbar pageTitle="List of Products" pageDescription="This is page that display all available products" currentPage={'View Cart'} user={user} /> : <Navbar pageTitle="List of Products" pageDescription="This is page that display all available products" currentPage="View Cart" />}

      <main>
        <Container maxW={'container.lg'}>This is cart page</Container>
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
