import { CircularProgress, Flex } from '@chakra-ui/react';

export const Loading = () => {
  return (
    <>
      <Flex justifyContent={'center'} alignItems={'center'} bg="gray.50" h={'100vh'}>
        <CircularProgress isIndeterminate size={130} color="brand.300" />
      </Flex>
    </>
  );
};
