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
} from '@chakra-ui/react';
// import { FormData } from 'next/form-data';
// import { NumberInputRoot } from '@/components/ui/number-input';

export const AddProductsModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState([]);
  const toast = useToast();

  const handleSubmit = async (e) => {
    // Convert image file to Base64
    const fileReader = new FileReader();
    fileReader.readAsDataURL(image);

    fileReader.onload = async () => {
      const base64Image = fileReader.result;

      const product = {
        name,
        description,
        price,
        quantity,
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
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme='blue' className='w-28'>
        Add Item
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Add New Item</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  name='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name='description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Price</FormLabel>
                <NumberInput defaultValue={0} min={0}>
                  <NumberInputField
                    name='price'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </NumberInput>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Quantity</FormLabel>
                <NumberInput defaultValue={0} min={0}>
                  <NumberInputField
                    name='quantity'
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </NumberInput>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Image</FormLabel>
                <Input
                  type='file'
                  accept='image/*'
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} type='submit'>
                Add Product
              </Button>
              <Button variant='ghost' onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
