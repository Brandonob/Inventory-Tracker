import React from 'react';
import { IoBagCheckOutline } from 'react-icons/io5';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

export const CartPreviewModal = ({ activeCart }) => {
  return (
    <>
      {/* <div className='fixed bottom-0 right-0 m-4'>
        <IconButton
          className='!bg-gray-400 !rounded-[20px] '
          aria-label='Save Cart'
        >
          <IoBagCheckOutline className='hover:text-yellow-400 text-white text-4xl h-[30px] w-[30px] ' />
        </IconButton>
      </div> */}
      <div className='fixed bottom-0 right-0 m-4'>
        {/* //pop up menu for viewing cart items */}
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
      </div>
    </>
  );
};
