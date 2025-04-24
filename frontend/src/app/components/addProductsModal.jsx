'use client';
import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  useDisclosure,
  NumberInputField,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { RiAddCircleFill } from "react-icons/ri";
import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
// import { addProduct } from '../redux/slices/productsSlice';
// import { loadComponents } from 'next/dist/server/load-components';
// import { FormData } from 'next/form-data';
// import { NumberInputRoot } from '@/components/ui/number-input';

export const AddProductsModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState(null);
  const toast = useToast();
  // const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    debugger;
    if (image) {
      //logic for post with image
      // Convert image file to Base64
      const fileReader = new FileReader();
      fileReader.readAsDataURL(image);

      fileReader.onload = async () => {
        const base64Image = fileReader.result;

        const product = {
          name: name.trim(),
          description: description.trim(),
          price: parseFloat(price),
          quantity: parseInt(quantity),
          image: base64Image, // Send Base64 string instead of File object
        };

        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });

        if (response.ok) {
          console.log('product created!');
          toast({
            title: 'Product created!',
            description: 'Product created successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });

          setTimeout(() => {
            // loadingstate
            window.location.reload();
          }, 3000);
        } else {
          const errorData = await response.json();
          console.log('Error creating product:', errorData);
          toast({
            title: 'Error creating product!',
            description: 'Product creation failed',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
        onClose();
      };
    } else {
      //logic for post without image
      const product = {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        quantity: parseInt(quantity),
        image: null,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      // const data = await response.json();

      if (response.ok) {
        console.log('product created!');
        toast({
          title: 'Product created!',
          description: 'Product created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        setTimeout(() => {
          // loadingstate
          window.location.reload();
        }, 3000);
      } else {
        const errorData = await response.json();
        console.log('Error creating product:', errorData);
        toast({
          title: 'Error creating product!',
          description: 'Product creation failed',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      onClose();
    }
  };

  return (
    <>
      <IconButton 
        onClick={onOpen} 
        height='45px'
        width='45px'
        borderRadius='50%'
        bg='rgb(90 103 250)'
        _hover={{ 
          bg: 'rgb(25,36,173,0.3)',
          boxShadow: '0 0 0 6px rgba(255,255,255,1)'
        }}
        margin='15px 30px'
        position='relative'
        zIndex='auto'
        color='white'
        cursor='pointer'
        transition='box-shadow 0.2s'
        sx={{
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            boxSizing: 'content-box',
            pointerEvents: 'none',
            top: 0,
            left: 0,
            padding: 0,
            boxShadow: '0 0 0 3px #fff',
            transition: 'transform 0.2s, opacity 0.2s',
          },
          '&:hover::after': {
            transform: 'scale(0.85)',
            opacity: 0.5
          }
        }}
      >
       <RiAddCircleFill 
        className='text-[#E8E9F3]'
        style={{
          fontSize: '48px',
          display: 'block',
          lineHeight: '90px',
          WebkitFontSmoothing: 'antialiased'
        }}
      />
      </IconButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent className='bg-white dark:bg-gray-800 transition-colors duration-200'>
          <form onSubmit={handleSubmit}>
            <ModalHeader className='text-black dark:text-white transition-colors duration-200' fontSize='30px' fontWeight='bold' display='flex' justifyContent='center'>
              Add New Item
              <ModalCloseButton className='text-black dark:text-white' />
            </ModalHeader>
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel className='text-black dark:text-white transition-colors duration-200'>Name</FormLabel>
                <Input
                  name='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='bg-white dark:bg-gray-700 text-black dark:text-white'
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel className='text-black dark:text-white transition-colors duration-200'>Description</FormLabel>
                <Textarea
                  name='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='bg-white dark:bg-gray-700 text-black dark:text-white'
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel className='text-black dark:text-white transition-colors duration-200'>Price</FormLabel>
                <NumberInput defaultValue={0} min={0}>
                  <NumberInputField
                    name='price'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className='bg-white dark:bg-gray-700 text-black dark:text-white'
                  />
                </NumberInput>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel className='text-black dark:text-white transition-colors duration-200'>Quantity</FormLabel>
                <NumberInput defaultValue={0} min={0}>
                  <NumberInputField
                    name='quantity'
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className='bg-white dark:bg-gray-700 text-black dark:text-white'
                  />
                </NumberInput>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel className='text-black dark:text-white transition-colors duration-200'>Image</FormLabel>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={(e) => setImage(e.target.files[0])}
                  className='bg-white dark:bg-gray-700 text-black dark:text-white'
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} type='submit' className='text-black dark:text-white transition-colors duration-200'>
                Add Product
              </Button>
              <Button variant='ghost' onClick={onClose} className='text-black dark:text-white transition-colors duration-200'>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};