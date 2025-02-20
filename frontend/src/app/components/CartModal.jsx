import React from 'react';
import { IoBagCheckOutline } from 'react-icons/io5';
import { FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
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
} from '@chakra-ui/react';

export const CartModal = ({ activeCart }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();

  return (
    <>
      {/* <Button onClick={onOpen} colorScheme='blue' className='w-28'> */}
      <Button
        onClick={onOpen}
        bg='gray.400'
        rounded='20px'
        position='fixed'
        bottom='0px'
        right='0px'
        margin='16px'
        height='40px'
        width='40px'
        p={2}
        _hover={{ '& svg': { color: '#FACC15' } }} // Using Chakra's hover style to target the SVG
      >
        <IoBagCheckOutline
          size={24}
          className=' text-white transition-colors'
        />
      </Button>
      {/* Add Item */}
      {/* </Button> */}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <VStack spacing={4} align='stretch'>
            {activeCart.products.length === 0 ? (
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
                  <Image
                    boxSize='50px'
                    src={cartItem.product.image}
                    alt={cartItem.product.name}
                    borderRadius='md'
                  />
                  <Text flex={1}>{cartItem.product.name}</Text>
                  <Text fontWeight='bold'>${cartItem.product.price}</Text>
                  <IconButton
                    icon={<FaTrash />}
                    colorScheme='red'
                    onClick={() =>
                      dispatch(
                        removeProductFromActiveCart(cartItem.product._id)
                      )
                    }
                    aria-label='Remove from cart'
                  />
                </HStack>
              ))
            )}
          </VStack>
        </ModalContent>
      </Modal>
      {/* <div className='fixed bottom-0 right-0 m-4'>
        <IconButton
          className='!bg-gray-400 !rounded-[20px] '
          aria-label='Save Cart'
        >
          <IoBagCheckOutline className='hover:text-yellow-400 text-white text-4xl h-[30px] w-[30px] ' />
        </IconButton>
      </div> */}
      {/* <div className='fixed bottom-0 right-0 m-4'>
        //pop up menu for viewing cart items
        <Menu>
          <MenuButton
            as={IconButton}
            bg='gray.400'
            rounded='20px'
            display='flex'
            alignItems='center'
            justifyContent='center'
            p={2}
            _hover={{ '& svg': { color: '#FACC15' } }} // Using Chakra's hover style to target the SVG
          >
            <IoBagCheckOutline className=' text-white text-4xl h-6 w-6 transition-colors' />
          </MenuButton>
          <MenuList>
            {activeCart.products.length > 0 ? (
              activeCart.products.map((item) => (
                <MenuItem key={item.product._id}>
                  {`${item.product.name} - ${item.product.description} X ${item.quantity}`}
                </MenuItem>
              ))
            ) : (
              <MenuItem>No items in cart!</MenuItem>
            )}
          </MenuList>
        </Menu>
      </div> */}
    </>
  );
};
