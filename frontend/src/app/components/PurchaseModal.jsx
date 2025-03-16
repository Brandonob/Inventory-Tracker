import { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  Heading,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  Input,
  Select,
  Switch,
} from '@chakra-ui/react';

export const PurchaseModal = ({ handleBackToCart }) => {
  const [showPartialAmount, setShowPartialAmount] = useState(false);

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        body: JSON.stringify(purchaseData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error purchasing:', error);
    }
  };

  return (
    <Box className='bg-white w-full h-full'>
      <ModalHeader>Complete Purchase</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <VStack spacing={4}>
          {/* Add your purchase form/content here */}
          {/* form inputs for Name, payment method dropdown, partial payment switch */}
          <FormControl isRequired>
            <FormLabel>Customer Name</FormLabel>
            <Input placeholder='Enter customer name' />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Payment Method</FormLabel>
            <Select placeholder='Select payment method'>
              <option value='cash'>Cash</option>
              <option value='zelle'>Zelle</option>
              <option value='cashapp'>Cash App</option>
            </Select>
          </FormControl>

          <FormControl display='flex' alignItems='center'>
            <FormLabel htmlFor='partial-payment' mb='0'>
              Allow Partial Payment
            </FormLabel>
            <Switch
              id='partial-payment'
              onChange={(e) => setShowPartialAmount(e.target.checked)}
            />
          </FormControl>

          {showPartialAmount && (
            <FormControl>
              <FormLabel>Partial Payment Amount</FormLabel>
              <InputGroup>
                <InputLeftAddon>$</InputLeftAddon>
                <Input type='number' placeholder='Enter amount' />
              </InputGroup>
            </FormControl>
          )}

          <Heading size='md'>Purchase Details</Heading>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme='gray' mr={3} onClick={handleBackToCart}>
          Back to Cart
        </Button>
        <Button colorScheme='blue' onClick={handlePurchase}>Confirm Purchase</Button>
      </ModalFooter>
    </Box>
  );
};
