import React from 'react';
import { useDispatch } from 'react-redux';
import {
  removeProductFromActiveCart,
  decrementCartItemQuantity,
  incrementCartItemQuantity,
} from '../redux/slices/cartsSlice';
import {
  useNumberInput,
  HStack,
  Button,
  Input,
  useToast,
} from '@chakra-ui/react';

export const QuantitySelector = ({ cartItem }) => {
  const product = cartItem.product;
  const value = cartItem.quantity;

  const dispatch = useDispatch();
  const toast = useToast();

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      value,
      step: 1,
      min: 0,
      max: product.quantity,
      precision: 0,
    });

  const increment = getIncrementButtonProps();
  const decrement = getDecrementButtonProps();
  const input = getInputProps();

  const handleDecrement = () => {
    debugger;
    if (parseInt(input.value) === 1) {
      dispatch(removeProductFromActiveCart(product));
    } else {
      dispatch(decrementCartItemQuantity({ product }));
    }
  };

  const handleIncrement = () => {
    if (input.value === product.quantity) {
      toast({
        title: 'Product quantity is maxed out',
        description: 'You can not add more than the product quantity',
        status: 'error',
      });
    } else {
      dispatch(incrementCartItemQuantity({ product }));
    }
  };

  return (
    <HStack maxW='320px'>
      <Button onClick={handleDecrement} {...decrement}>
        -
      </Button>
      <Input {...input} />
      <Button onClick={handleIncrement} {...increment}>
        +
      </Button>
    </HStack>
  );
};
