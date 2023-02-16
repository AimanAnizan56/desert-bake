import { Fragment } from 'react';
import Link from 'next/link';
import { Box, Text, Grid, Img, Button, Tooltip } from '@chakra-ui/react';
import { UserIcon, ShoppingBagIcon, ArrowLeftOnRectangleIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';

type UserType = {
  id?: number;
  name?: string;
  email?: string;
  admin?: boolean;
};

const Navbar = ({ pageTitle, pageDescription, user, currentPage }: { pageTitle: string; pageDescription: string; user?: UserType; currentPage?: string }) => {
  const router = useRouter();

  const title = `Dessert Bake | ${pageTitle}`;

  // *** for admin
  if (user && user.admin) {
    const Icons: { href: string; icon: JSX.Element; label: string; fc: Function }[] = [
      {
        href: '/admin/profile',
        icon: <UserIcon />,
        label: 'My Profile',
        fc: () => {},
      },
      {
        href: '/admin',
        icon: <ArrowLeftOnRectangleIcon />,
        label: 'Logout',
        fc: async (e: any) => {
          // logout
          e.preventDefault();

          try {
            let res = await axios.get('/api/v1/admin/logout');
            const { logout, message } = await res.data;

            if (logout) {
              router.push('/admin/signin');
            }
          } catch (err) {
            console.log('err', err);
          }
        },
      },
    ];

    const pages: Array<{
      link: string;
      title: string;
    }> = [
      {
        link: '/admin',
        title: 'Home',
      },
      {
        link: '/admin/products',
        title: 'Products',
      },
      {
        link: '/admin/orders',
        title: 'Orders',
      },
    ];

    return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content={pageDescription} key="desc" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={pageDescription} />
          <link rel="icon" href="/favicon.jpg" />
        </Head>
        <Box as="nav" bgColor="white" boxShadow="base" py="0.7rem" px="4rem" fontSize="1.1rem">
          <Grid templateColumns={'1fr 1fr 1fr'} alignItems={'center'}>
            <Box justifySelf={'start'}>
              <Link href="/">
                <Text as="b" fontSize="1.3rem">
                  <Img src="/img/logo.png" alt="Dessert Bake" h="3rem" />
                </Text>
              </Link>
            </Box>

            <Box display="flex" gap="2rem" justifySelf={'center'}>
              {pages.map((page, index) => (
                <Fragment key={index}>
                  <Link href={page.link}>
                    <Text _hover={{ color: 'brand.400' }} color={page.title == currentPage ? 'brand.400' : 'black'} fontWeight={page.title == currentPage ? 'bold' : 'normal'}>
                      {page.title}
                    </Text>
                  </Link>
                </Fragment>
              ))}
            </Box>

            <Box display="flex" gap="1rem" alignItems={'center'} justifySelf={'end'}>
              {Icons.map((icon, i) => (
                <Tooltip key={i} placement={'bottom'} label={icon.label}>
                  <Box boxSize="1.3rem" _hover={{ color: 'brand.400' }} color={icon.label == currentPage ? 'brand.400' : 'black'} fontWeight={icon.label == currentPage ? 'bold' : 'normal'}>
                    <Link
                      href={icon.href}
                      onClick={(e: Event) => {
                        icon.fc(e);
                      }}
                    >
                      {icon.icon}
                    </Link>
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Grid>
        </Box>
      </>
    );
  }

  // *** For customer
  const Icons: { href: string; icon: JSX.Element; label: string; fc: Function }[] = [
    {
      href: '/profile',
      icon: <UserIcon />,
      label: 'My Profile',
      fc: () => {},
    },
    {
      href: '/cart',
      icon: <ShoppingBagIcon />,
      label: 'View Cart',
      fc: () => {},
    },
    {
      href: '/order',
      icon: <ClipboardDocumentCheckIcon />,
      label: 'View Order',
      fc: () => {},
    },
    {
      href: '',
      icon: <ArrowLeftOnRectangleIcon />,
      label: 'Logout',
      fc: async (e: any) => {
        // logout
        e.preventDefault();

        try {
          let res = await axios.get('/api/v1/customer/logout');
          const { logout, message } = await res.data;

          if (logout) {
            if (router.pathname == '/') {
              router.reload();
              return;
            }
            router.push('/');
          }
        } catch (err) {
          console.log('err', err);
        }
      },
    },
  ];

  const pages: Array<{
    link: string;
    title: string;
  }> = [
    {
      link: '/',
      title: 'Home',
    },
    {
      link: '/products',
      title: 'Products',
    },
    {
      link: '/about',
      title: 'About',
    },
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} key="desc" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={pageDescription} />
        <link rel="icon" href="/favicon.jpg" />
      </Head>
      <Box as="nav" bgColor="white" boxShadow="base" py="0.7rem" px="4rem" fontSize="1.1rem">
        <Grid templateColumns={'1fr 1fr 1fr'} alignItems={'center'}>
          <Box justifySelf={'start'}>
            <Link href="/">
              <Text as="b" fontSize="1.3rem">
                <Img src="/img/logo.png" alt="Dessert Bake" h="3rem" />
              </Text>
            </Link>
          </Box>

          <Box display="flex" gap="2rem" justifySelf={'center'}>
            {pages.map((page, index) => (
              <Fragment key={index}>
                <Link href={page.link}>
                  <Text _hover={{ color: 'brand.400' }} color={page.title == currentPage ? 'brand.400' : 'black'} fontWeight={page.title == currentPage ? 'bold' : 'normal'}>
                    {page.title}
                  </Text>
                </Link>
              </Fragment>
            ))}
          </Box>

          <Box display="flex" gap="1rem" alignItems={'center'} justifySelf={'end'}>
            {user ? (
              <>
                {Icons.map((icon, i) => (
                  <Tooltip key={i} placement={'bottom'} label={icon.label}>
                    <Box boxSize="1.3rem" _hover={{ color: 'brand.400' }} color={icon.label == currentPage ? 'brand.400' : 'black'} fontWeight={icon.label == currentPage ? 'bold' : 'normal'}>
                      <Link
                        href={icon.href}
                        onClick={(e: Event) => {
                          icon.fc(e);
                        }}
                      >
                        {icon.icon}
                      </Link>
                    </Box>
                  </Tooltip>
                ))}
              </>
            ) : (
              <>
                <Button bgColor={'brand.400'} color={'white'} _hover={{ bgColor: 'brand.600' }}>
                  <Link href={'/signin'}>Login</Link>
                </Button>
                <Button bgColor={'transparent'} color={'brand.400'} borderWidth={'2px'} borderColor={'brand.400'} _hover={{ bgColor: 'brand.50' }}>
                  <Link href={'/signup'}>Sign Up</Link>
                </Button>
              </>
            )}
          </Box>
        </Grid>
      </Box>
    </>
  );
};

export default Navbar;
