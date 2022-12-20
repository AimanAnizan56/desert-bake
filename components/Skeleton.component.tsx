import { Box, Flex, GridItem, Skeleton, SkeletonText } from '@chakra-ui/react';

export const SkeletonProductGridItem = () => {
  return (
    <>
      <GridItem boxShadow={'var(--box-shadow)'} borderRadius={'5px'} px={'1rem'} py={'1.4rem'}>
        <Skeleton height={'100px'} />
        <SkeletonText noOfLines={5} mt={'0.5rem'} skeletonHeight={'10px'} />
      </GridItem>
    </>
  );
};

export const SkeletonProductCustomerGrid = () => {
  return (
    <GridItem boxShadow={'var(--box-shadow)'} borderRadius={'5px'} px={'0.5rem'} py={'1rem'}>
      <Box as="div" mb={'0.5rem'} position={'relative'} width={'100%'} height={'200px'}>
        <Skeleton height={'100%'} />
      </Box>

      <Flex alignItems={'center'} mb={'0.5rem'} justifyContent={'space-between'} gap={3}>
        <Box as="div" fontWeight={'bold'}>
          <Skeleton height={'24px'} width={'180px'} />
        </Box>
        <Box as="div" fontWeight={'bold'} width={'100px'} textAlign={'right'}>
          <Skeleton height={'24px'} />
        </Box>
      </Flex>

      <Box as="div" mb={'1rem'} color={'gray.400'}>
        <Skeleton height={'24px'} />
      </Box>

      <Box as="div">
        <Box as="div" mb={'0.5rem'}>
          <Skeleton height={'40px'} width={'100%'} />
        </Box>
      </Box>
    </GridItem>
  );
};
