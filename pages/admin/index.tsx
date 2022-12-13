import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { ironSessionOptions } from '../../lib/helper';

const Home = () => {
  return <div>Homepage for admin</div>;
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
