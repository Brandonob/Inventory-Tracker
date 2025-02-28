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

export const SaveCartModal = ({ activeCart }) => {
  const [cartName, setCartName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    //pass down cartName to savecart function
    //call savecart function
    try {
    } catch (error) {}
  };

  return (
    <Box className='bg-white w-full h-full'>
      <ModalHeader>
        Save Cart
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody className='max-h-[485px] overflow-y-auto'>
        <VStack spacing={4} align='stretch'>
          <form onSubmit={handleSubmit}>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
                name='cartName'
                value={cartName}
                placeholder='Enter cart name'
                onChange={(e) => setCartName(e.target.value)}
              />
            </FormControl>
          </form>
        </VStack>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={handleSaveCart}>
          Save Cart
        </Button>
      </ModalFooter>
    </Box>
  );
};
