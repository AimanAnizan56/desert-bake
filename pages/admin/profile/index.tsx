import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Navbar from '../../../components/Navbar';
import { ironSessionOptions } from '../../../lib/helper';

const Profile = (props: any) => {
  return (
    <>
      <Navbar pageTitle="My Profile" pageDescription="Profile for admin" currentPage="My Profile" user={props.user} />

      <main>This is profile page for admin</main>
    </>
  );
};

export default Profile;

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
