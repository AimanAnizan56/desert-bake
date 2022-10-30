import React from 'react';
import Link from 'next/link';
import { Box, Text, Flex, Divider } from '@chakra-ui/react';

const Navbar = () => {
  return (
    <nav>
      <Box bgColor="cyan.600" py="1rem" px="1.3rem" fontSize="1.2rem" color="gray.50">
        <Flex justify="space-between">
          <Box>
            <Link href="/">
              <Text as="b" fontSize="1.3rem">
                Desert Bake
              </Text>
            </Link>
          </Box>

          <Box display="flex" gap="1rem">
            <Divider orientation="vertical" />
            <Link href="/">
              <Text>Home</Text>
            </Link>
            <Divider orientation="vertical" />
            <Link href="/about">
              <Text>About us</Text>
            </Link>
            <Divider orientation="vertical" />
            <Link href="/products">
              <Text>Our Product</Text>
            </Link>
            <Divider orientation="vertical" />
          </Box>

          <Box>Account</Box>
        </Flex>
      </Box>
    </nav>
  );
};

export default Navbar;
