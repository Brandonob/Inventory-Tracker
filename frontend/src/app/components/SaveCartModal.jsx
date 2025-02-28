import { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  FormControl,
  ModalHeader,
  ModalFooter,
  Input,
  FormLabel,
  VStack,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
export const SaveCartModal = ({ activeCart, handleBackToCart }) => {
  const [cartName, setCartName] = useState('');
  console.log('SAVE CART MODAL ACTIVE CART', activeCart);

  const handleSaveCart = (e) => {
    e.preventDefault();
    //pass down cartName to savecart function
    //call savecart function
    try {
    } catch (error) {}
  };

  return (
    <Box className='bg-white w-full h-full'>
      <form onSubmit={handleSaveCart}>
        <ModalHeader>
          Save Cart
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody className='max-h-[485px] overflow-y-auto'>
          <VStack spacing={4} align='stretch'>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
                name='cartName'
                value={cartName}
                placeholder='Enter cart name'
                onChange={(e) => setCartName(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='gray' mr={3} onClick={handleBackToCart}>
            Back to Cart
          </Button>
          <Button type='submit' colorScheme='blue' mr={3}>
            Save Cart
          </Button>
        </ModalFooter>
      </form>
    </Box>
  );
};
