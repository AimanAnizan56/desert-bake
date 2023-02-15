import { Button } from '@chakra-ui/react';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { ironSessionOptions } from '../../lib/helper';

type PropsType = {
  user: {
    id: number;
    name: string;
    email: string;
    admin: boolean;
  };
};

const Customer = (props: PropsType) => {
  const router = useRouter();

  return (
    <>
      <Navbar pageTitle="My Profile" pageDescription="Profile for customer" currentPage="My Profile" user={props.user} />
    </>
  );
};

export default Customer;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({ req }) => {
  if (!req.session.user) {
    return {
      redirect: {
        permanent: true,
        destination: '/signin',
      },
    };
  }

  return {
    props: {
      user: req.session.user ? req.session.user : {},
    },
  };
}, ironSessionOptions);
