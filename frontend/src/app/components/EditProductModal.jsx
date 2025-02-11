import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import { TiEdit } from 'react-icons/ti';

export const EditProductModal = ({ product }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);
  const [image, setImage] = useState(product.image);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      } else {
        const errorData = await response.json();
        console.log('Error creating product:', errorData);
      }
      onClose();
    };
  };
  return (
    <>
      {/* edit icon that will open modal */}
      <IconButton onClick={onOpen} aria-label='Edit'>
        <TiEdit />
      </IconButton>
      {/* icon={EditIcon}
        aria-label='Edit'
        onClick={onOpen}
        colorScheme='blue'
        className='w-28' */}

      {/* <Button onClick={onOpen} colorScheme='blue' className='w-28'>
        Add Item
      </Button> */}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>
              Edit {product.name} - {product.description}
            </ModalHeader>
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
                Edit Product
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
