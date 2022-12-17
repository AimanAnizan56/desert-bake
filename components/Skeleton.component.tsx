import { GridItem, Skeleton, SkeletonText } from "@chakra-ui/react";

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