import React from 'react';
import {
  Button,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  IconButton,
} from '@chakra-ui/react';
import { ImMenu3 } from 'react-icons/im';
// import { ImMenu4 } from 'react-icons/im';

export const NavMenu = () => {
  return (
    <>
      <div className='fixed top-0 right-0 m-4'>
        <Menu>
          <MenuButton
            as={Button}
            aria-label='Save Cart'
            bg='gray.400'
            rounded='20px'
            display='flex'
            alignItems='center'
            justifyContent='center'
            p={2}
            _hover={{ '& svg': { color: '#FACC15' } }} // Using Chakra's hover style to target the SVG
          >
            <ImMenu3 className='text-white text-4xl h-6 w-6 transition-colors' />
          </MenuButton>
          <MenuList>
            <MenuItem
              as='a'
              href='http://localhost:3000/carts'
              value='savedCarts'
            >
              Carts
            </MenuItem>
            <MenuItem as='a' href='http://localhost:3000/orders' value='orders'>
              Orders
            </MenuItem>
            {/* <MenuItem
              as='a'
              href='https://www.crunchyroll.com/attack-on-titan'
              value='attack-on-titan'
            >
              Attack on Titan
            </MenuItem> */}
          </MenuList>
        </Menu>
      </div>
    </>
  );
};
