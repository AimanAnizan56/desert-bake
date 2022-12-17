import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Navbar from '../../../../components/Navbar';
import { ironSessionOptions } from '../../../../lib/helper';

const EditProduct = (props: any) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Navbar pageTitle="Products" pageDescription="Product page" user={props.user} currentPage={'Products'} />

      <main>Product id: {id}</main>
    </>
  );
};

export default EditProduct;

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
