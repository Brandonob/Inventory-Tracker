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
  useToast,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { saveActiveCart } from '../redux/slices/cartsSlice';

export const SaveCartModal = ({ activeCart, handleBackToCart }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [cartName, setCartName] = useState('');
  console.log('SAVE CART MODAL ACTIVE CART', activeCart);

  const handleSaveCart = (e) => {
    e.preventDefault();

    if (!cartName) {
      toast({
        title: 'Error',
        description: 'Please enter a cart name',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    //pass down cartName to savecart function
    //call savecart function
    try {
      debugger;
      dispatch(saveActiveCart(activeCart, cartName));

      toast({
        title: 'Cart saved',
        description: 'Cart saved successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.log('ERROR IN SAVE CART MODAL', error.message);
      toast({
        title: 'Cart not saved',
        description: 'Cart not saved successfully',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box className='bg-black w-full h-full'>
      <form onSubmit={handleSaveCart}>
        <ModalHeader fontSize='40px' textColor='white' fontWeight='bold' display='flex' justifyContent='center'>
          Save Cart
          <ModalCloseButton />
        </ModalHeader>
        <div className='ml-[30%] mr-[30%]'>
          <ModalBody className='max-h-[485px] overflow-y-auto'>
            <VStack border={'1px solid white'} padding={'16px'} borderRadius={'6px'} spacing={4} align='stretch'>
              <FormControl mb={4}>
                <FormLabel textColor='white'>Cart Name</FormLabel>
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
        </div>
      </form>
    </Box>
  );
};
