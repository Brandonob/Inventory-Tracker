import { useState, useSelector } from 'react';
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
  useToast,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { clearActiveCart } from '../redux/slices/cartsSlice';
import { fetchAllProducts } from '../redux/slices/productsSlice';

export const PurchaseModal = ({ handleBackToCart, activeCart, calculateCartTotal, onClose }) => {
  const user = useSelector(state => state.users.user);
  const [showPartialAmount, setShowPartialAmount] = useState(false);
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [partialPaymentAmount, setPartialPaymentAmount] = useState(0);
  const toast = useToast();
  const dispatch = useDispatch();
  // console.log('user', user);
  

  const handlePurchase = async (e) => {
    e.preventDefault();
    try {
      debugger;
      const purchaseData = {
        customerName: customerName,
        cartId: activeCart.activeCartId || null,
        products: activeCart.products,
        total: calculateCartTotal(),
        paymentMethod: paymentMethod,
        partialPaymentAmount: partialPaymentAmount,
        paymentStatus: partialPaymentAmount > 0 ? 'partial' : 'paid',
        status: user?.isAdmin ? 'approved' : 'pending',
        ownerId: user?._id,
        createdAt: new Date(),
      };
    
      const response = await fetch('/api/purchases', {
        method: 'POST',
        body: JSON.stringify(purchaseData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to create purchase');
      }

      const data = await response.json();
      console.log('Purchase created:', data);
      
      if (user?.isAdmin) {
        await updateProductStock(activeCart.products);
      }
      dispatch(clearActiveCart());
      localStorage.removeItem('cartState');
      //set all modals to close
      handleBackToCart();
      //close cart modal
      onClose();
      //fetch all products
      dispatch(fetchAllProducts());
      
      toast({
        title: 'Purchase Completed',
        description: 'Purchase created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
    } catch (error) {
      console.error('Error purchasing:', error.message || 'An unknown error occurred');
      toast({
        title: 'Error',
        description: 'Failed to create purchase',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateProductStock = async (products) => {
    try {
      debugger;
      const stockUpdates = products.map(product => ({
        productId: product.product._id,
        quantity: product.quantity
      }));

      const response = await fetch('/api/products/update-stock', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: stockUpdates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product stock');
      }

      const data = await response.json();
      console.log('Stock updated successfully:', data);
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: 'Warning',
        description: 'Purchase completed but failed to update stock quantities',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
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
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Payment Method</FormLabel>
            <Select
              placeholder='Select payment method'
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              >
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
                  <Input
                  type='number'
                  value={partialPaymentAmount}
                  onChange={(e) => setPartialPaymentAmount(e.target.value)}
                />
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
