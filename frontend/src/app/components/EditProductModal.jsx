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
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import { TiEdit } from 'react-icons/ti';

export const EditProductModal = ({ product }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);
  const [image, setImage] = useState(product.image);
  const toast = useToast();

  // Helper function to update the product
  const updateProduct = async (imageData) => {
    const updatedProduct = {
      id: product._id,
      name,
      description,
      price,
      quantity,
      image: imageData,
    };

    console.log('>>>>>updatedProduct<<<<<', updatedProduct);

    const response = await fetch(`/api/products/${product._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    });

    if (response.ok) {
      console.log('product updated!');
      toast({
        title: 'Product updated!',
        description: 'Product updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      const errorData = await response.json();
      console.log('Error updating product:', errorData);
      toast({
        title: 'Error updating product!',
        description: 'Product update failed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };

  const handleSubmit = async (e) => {
    // If image is a File object, convert to base64
    if (image instanceof File) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(image);

      fileReader.onload = async () => {
        await updateProduct(fileReader.result);
      };
    } else {
      // Image is already a base64 string or null
      await updateProduct(image);
    }
  };

  return (
    <>
      {/* edit icon that will open modal */}
      <Tooltip label='Edit product' placement='right'>
        <IconButton onClick={onOpen} aria-label='Edit'>
          <TiEdit />
        </IconButton>
      </Tooltip>

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
                <NumberInput defaultValue={product.price} min={0}>
                  <NumberInputField
                    name='price'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </NumberInput>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Quantity</FormLabel>
                <NumberInput defaultValue={product.quantity} min={0}>
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
