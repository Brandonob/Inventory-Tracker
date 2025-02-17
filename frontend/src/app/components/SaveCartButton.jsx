import React from 'react';
import { Button } from '@chakra-ui/react';

export const SaveCartButton = ({ activeCart }) => {
  const handleSaveCart = () => {
    console.log(activeCart);
  };
  return (
    <div>
      <Button onClick={handleSaveCart}>Save Cart</Button>
    </div>
  );
};
