import React from 'react';
import { Skeleton, Box } from '@chakra-ui/react';

export const LogoLoadingState = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Skeleton width="300px" height="300px" borderRadius="full" />
    </Box>
  );
}; 