import { Fragment } from 'react';
import Link from 'next/link';
import { Box, Text, Flex, Img, IconButton } from '@chakra-ui/react';
import { UserIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import pages from '../lib/list_page';

const Navbar = () => {
  const Icons: { href: string; icon: JSX.Element }[] = [
    {
      href: '/user',
      icon: <UserIcon />,
    },
    {
      href: '/cart',
      icon: <ShoppingBagIcon />,
    },
  ];

  return (
    <Box as="nav" bgColor="white" boxShadow="base" py="1rem" px="5rem" fontSize="1.2rem">
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

        <Box display="flex" gap="1rem">
          {Icons.map((icon, i) => (
            <Box key={i} boxSize="1.3rem" _hover={{ color: 'brand.400' }}>
              <Link href={icon.href}>{icon.icon}</Link>
            </Box>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
