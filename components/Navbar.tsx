import { Fragment } from 'react';
import Link from 'next/link';
import { Box, Text, Flex, Img } from '@chakra-ui/react';
import { UserIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';

const Navbar = ({ pageTitle, pageDescription }: { pageTitle: string; pageDescription: string }) => {
  const Icons: { href: string; icon: JSX.Element }[] = [
    {
      href: '/customer',
      icon: <UserIcon />,
    },
    {
      href: '/cart',
      icon: <ShoppingBagIcon />,
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
      link: '/about',
      title: 'About Us',
    },
    {
      link: '/products',
      title: 'Products',
    },
  ];

  const title = `Desert Bake | ${pageTitle}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={pageDescription} />
        <link rel="icon" href="/favicon.jpg" />
      </Head>
      <Box as="nav" bgColor="white" boxShadow="base" py="0.7rem" px="4rem" fontSize="1.1rem">
        <Flex justify="space-between" alignItems="center">
          <Box>
            <Link href="/">
              <Text as="b" fontSize="1.3rem">
                <Img src="/img/logo.png" alt="Desert Bake" h="3rem" />
              </Text>
            </Link>
          </Box>

          <Box display="flex" gap="2rem">
            {pages.map((page, index) => (
              <Fragment key={index}>
                <Link href={page.link}>
                  <Text _hover={{ color: 'brand.400' }}>{page.title}</Text>
                </Link>
              </Fragment>
            ))}
          </Box>

          <Box display="flex" gap="1rem" alignItems={'center'}>
            {Icons.map((icon, i) => (
              <Box key={i} boxSize="1.3rem" _hover={{ color: 'brand.400' }}>
                <Link href={icon.href}>{icon.icon}</Link>
              </Box>
            ))}
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Navbar;
