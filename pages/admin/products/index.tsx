import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Navbar from '../../../components/Navbar';
import { ironSessionOptions } from '../../../lib/helper';

const Products = (props: any) => {
  return (
    <>
      <Navbar pageTitle="Products" pageDescription="Product page" user={props.user} currentPage={'Products'} />

      <main>This is products for admin page</main>
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
