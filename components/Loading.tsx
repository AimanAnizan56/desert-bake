import { Box, CircularProgress, Flex } from '@chakra-ui/react';

export const Loading = () => {
  return (
    <Box as="div" position={'fixed'} top={'0'} left={'0'} w={'100vw'} h={'100vh'} cursor={'progress'}>
      <Flex justifyContent={'center'} alignItems={'center'} w={'100vw'} h={'100vh'} bg={'transparent'} bgColor={'rgba(255, 255, 255, 0.64)'}>
        <CircularProgress isIndeterminate size={130} color="brand.300" />
      </Flex>
    </Box>
  );
};
