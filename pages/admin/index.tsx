import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Navbar from '../../components/Navbar';
import { ironSessionOptions } from '../../lib/helper';

const Home = (props: any) => {
  return (
    <>
      <Navbar pageTitle="Admin Home" pageDescription="Homepage for admin" user={props.user} currentPage={'Home'} />

      <main>This is homepage for admin</main>
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
