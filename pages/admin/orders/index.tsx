import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Navbar from '../../../components/Navbar';
import { ironSessionOptions } from '../../../lib/helper';

const Orders = (props: any) => {
  return (
    <>
      <Navbar pageTitle="View Orders" pageDescription="View Order for admin" currentPage="Orders" user={props.user} />

      <main>This is orders page for admin</main>
    </>
  );
};

export default Orders;

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
