import React, { useState } from 'react';
import { Button, Input, useDisclosure } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { SaveCartModal } from './SaveCartModal';

export const SaveCartButton = ({ activeCart, isEmptyCart }) => {
  const { isOpen, onOpen, onClose } = useDisclosure;
  const [cartName, setCartName] = useState('');
  const toast = useToast();

  const getActiveCartData = () => {
    const data = [];
    activeCart.products.forEach((product) => {
      //   debugger;
      data.push({
        productId: product.product._id,
        productImg: product.product.image,
        productPrice: product.product.price,
        quantity: product.quantity,
      });
    });
    return data;
  };

  const handleSaveCart = async (e) => {
    e.preventDefault();
    // debugger;
    try {
      const activeCartData = await getActiveCartData();
      //update cart in database to store activeCart
      const response = await fetch('/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartName, activeCartData }),
      });
      const data = await response.json();
      console.log('UPDATED CART', data);

      if (response.ok) {
        console.log('Cart updated');
        toast({
          title: 'Cart updated',
          description: 'Cart updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.log('Cart not updated');
        toast({
          title: 'Cart not updated',
          description: 'Cart not updated successfully',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      //   dispatch(setActiveCart(data));
    } catch (error) {
      console.log('ERROR IN SAVE CART', error.message);
    }
  };

  // const saveCartModal = () => {
  //   return (
  //     <Modal isOpen={isOpen} onClose={onClose}>
  //       <Box className='bg-white w-full h-full'>
  //         <ModalHeader>
  //           Save Cart
  //           <ModalCloseButton />
  //         </ModalHeader>
  //         <ModalBody className='max-h-[485px] overflow-y-auto'>
  //           <VStack spacing={4} align='stretch'>
  //             <FormControl mb={4}>
  //               <FormLabel>Name</FormLabel>
  //               <Input
  //                 name='cartName'
  //                 value={cartName}
  //                 placeholder='Enter cart name'
  //                 onChange={(e) => setCartName(e.target.value)}
  //               />
  //             </FormControl>
  //           </VStack>
  //         </ModalBody>

  //         <ModalFooter>
  //           <Button colorScheme='blue' mr={3} onClick={handleSaveCart}>
  //             Save Cart
  //           </Button>
  //         </ModalFooter>
  //       </Box>
  //     </Modal>
  //   );
  // };

  return (
    <div>
      <SaveCartModal
        isOpen={isOpen}
        onClose={onClose}
        handleSaveCart={handleSaveCart}
        cartName={cartName}
        setCartName={setCartName}
      />
      <Button onClick={onOpen} isDisabled={isEmptyCart}>
        Save Cart
      </Button>
    </div>
  );
};
