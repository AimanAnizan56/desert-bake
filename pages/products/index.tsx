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

  useEffect(() => {
    if (Object.keys(props.user).length != 0) {
      setUser({
        ...props.user,
      });
    }
  }, []);

  return (
    <>
      {user ? <Navbar pageTitle="List of Products" pageDescription="This is page that display all available products" user={user} /> : <Navbar pageTitle="List of Products" pageDescription="This is page that display all available products" />}
      <main>This is product</main>
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
