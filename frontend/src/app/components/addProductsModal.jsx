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

  //   const (e)=> setName(e.target.value) = (e) => {
  //     const { name, value } = e.target;
  //     setFormData({ ...formData, [name]: value });
  //   };

  //   const handleImageChange = (e) => {
  //     setFormData({ ...formData, image: e.target.files[0] });
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Submitted Data:', formData);

    //Start Code goes here

    const product = {
      name: name,
      description: description,
      price: price,
      quantity: quantity,
      image: image,
    };
    // const formData = new FormData();
    // formData.append('name', formData.name);
    // formData.append('description', formData.description);
    // formData.append('price', formData.price);
    // formData.append('quantity', formData.quantity);
    // formData.append('image', formData.image);

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      console.log('product created!');
    } else {
      const errorData = await response.json();
      console.log('Error creating product:', errorData);
    }
    //End Code goes here
    onClose();
  };
  return (
    <>
      <Button onClick={onOpen} colorScheme='blue'>
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
                Submit
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
