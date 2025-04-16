import React from 'react';
import { Skeleton, HStack } from '@chakra-ui/react';

export const ButtonLoadingState = () => {
  return (
    <HStack spacing={4}>
      <Skeleton height="40px" width="120px" borderRadius="md" />
      <Skeleton height="40px" width="120px" borderRadius="md" />
    </HStack>
  );
}; 