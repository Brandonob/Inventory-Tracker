import React from 'react';
import { Skeleton, Box } from '@chakra-ui/react';

export const NavMenuLoadingState = () => {
  return (
    <Box position="fixed" top="4" left="4">
      <Skeleton width="40px" height="40px" borderRadius="full" />
    </Box>
  );
}; 