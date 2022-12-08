import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { ironSessionOptions } from '../lib/helper';

export default function Home(props: any) {
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
      {user ? <Navbar pageTitle="Homepage" pageDescription="Desert Bake Homepage" user={user} /> : <Navbar pageTitle="Homepage" pageDescription="Desert Bake Homepage" />}

      <main>
        <div>Homepage</div>
        {user && (
          <div>
            User is set to
            <div>Id: {user.id}</div>
            <div>Name: {user.name}</div>
            <div>Email: {user.email}</div>
          </div>
        )}
      </main>

      <footer>Footer</footer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({ req }) => {
  return {
    props: {
      user: req.session.user ? req.session.user : {},
    },
  };
}, ironSessionOptions);
