import React, { useState } from 'react';
import { IoBagCheckOutline } from 'react-icons/io5';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { PurchaseModal } from './PurchaseModal';
import { removeProductFromActiveCart } from '../redux/slices/cartsSlice';

import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  VStack,
  HStack,
  Image,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
  Slide,
  Box,
} from '@chakra-ui/react';
import { QuantitySelector } from './QuantitySelector';
// import { SaveCartButton } from './SaveCart';
import { SaveCartModal } from './SaveCartModal';

export const CartModal = ({ activeCart }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showPurchase, setShowPurchase] = useState(false);
  const [showSaveCart, setShowSaveCart] = useState(false);
  const user = useSelector((state) => state.users.user);
  const isEmptyCart = !activeCart?.products?.length;
  console.log('CART MODAL', activeCart);

  const dispatch = useDispatch();

  const calculateCartTotal = () => {
    if (!activeCart?.products?.length) return 0;
    
    return activeCart.products.reduce((total, cartItem) => {
      return total + (cartItem.product.price * cartItem.quantity);
    }, 0);
  };

  const handlePurchaseClick = () => {
    setShowPurchase(true);
  };

  const handleBackToCart = () => {
    //checks if purchase modal is open and closes it
    //If not it closes the save cart modal
    showPurchase ? setShowPurchase(false) : setShowSaveCart(false);
  };

  const handleSaveCartClick = () => {
    setShowSaveCart(true);
  };

  return (
    <>
      {/* <Button onClick={onOpen} colorScheme='blue' className='w-28'> */}
      <Button
        onClick={onOpen}
        bg='gray.400'
        rounded='20px'
        position='fixed'
        top='0px'
        right='0px'
        margin='16px'
        height='40px'
        width='40px'
        p={2}
        _hover={{ '& svg': { color: '#F7B578' } }} // Using Chakra's hover style to target the SVG
      >
        <IoBagCheckOutline
          size={24}
          className=' text-white transition-colors'
        />
      </Button>
      {/* Add Item */}
      {/* </Button> */}

      <Modal size='lg' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          {showPurchase ? (
            <Slide direction='right' in={true} style={{ width: '100%' }}>
              <PurchaseModal
                handleBackToCart={handleBackToCart}
                activeCart={activeCart}
                calculateCartTotal={calculateCartTotal}
                onClose={onClose}
               />
            </Slide>
          ) : showSaveCart ? (
            <Slide direction='right' in={true} style={{ width: '100%' }}>
              <SaveCartModal
                activeCart={activeCart}
                handleBackToCart={handleBackToCart}
              />
            </Slide>
          ) : (
            <Slide direction='left' in={true} style={{ width: '100%' }}>
              <Box className='bg-white w-full h-full'>
                <ModalHeader>
                  Cart
                  <ModalCloseButton />
                </ModalHeader>
                <ModalBody className='max-h-[485px] overflow-y-auto'>
                  <VStack spacing={4} align='stretch'>
                    {!activeCart?.products?.length ? (
                      <Text>Your cart is empty</Text>
                    ) : (
                      activeCart.products.map((cartItem) => (
                        <HStack
                          key={cartItem.product._id}
                          p={3}
                          borderWidth={1}
                          borderRadius='md'
                          justifyContent='space-between'
                        >
                          {/* <Image
                            boxSize='50px'
                            src={cartItem.product.image}
                            alt={cartItem.product.name}
                            borderRadius='md'
                          /> */}
                          <Text flex={1}>{cartItem.product.name}</Text>
                          <Text fontWeight='bold'>
                            ${cartItem.product.price}
                          </Text>
                          <QuantitySelector cartItem={cartItem} />
                        </HStack>
                      ))
                    )}
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  <Text mr={4} fontWeight="bold">
                    Total: ${calculateCartTotal().toFixed(2)}
                  </Text>
                  {user?.isAdmin && (
                      <Button
                        isDisabled={isEmptyCart}
                        onClick={handleSaveCartClick}
                    >
                      Save Cart
                    </Button>
                  )}
                  <Button
                    isDisabled={isEmptyCart}
                    colorScheme='blue'
                    mr={3}
                    onClick={handlePurchaseClick}
                  >
                    Purchase
                  </Button>
                </ModalFooter>
              </Box>
            </Slide>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
