'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  Heading,
  Text,
  Checkbox,
  useToast,
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/usersSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: "Passwords do not match.",
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const user = { userName, password, phoneNumber };
    console.log('Sending sign-up request with:', user);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('user signed up!', data);
        dispatch(setUser(data));
        localStorage.setItem('user', JSON.stringify(data));
        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/');
      } else {
        const errorData = await response.json();
        console.error('Error signing up:', errorData.error);
        toast({
          title: 'Sign Up Failed',
          description: errorData.error || 'An unknown error occurred.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to sign up:', error);
      toast({
        title: 'Sign Up Error',
        description: 'Failed to connect to the server. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW='sm'
      mx='auto'
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius='lg'
      boxShadow='lg'
    >
      <Heading mb={4} textAlign='center'>
        Sign Up
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              name='username'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder='Enter username'
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              name='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter password'
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              name='confirmPassword'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm your password'
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input
              name='phoneNumber'
              type='tel'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder='Enter phone number'
            />
          </FormControl>
          <FormControl>
             <Checkbox
                isChecked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                isRequired
             >
               I agree that my phone number will be used for verification purposes.
             </Checkbox>
          </FormControl>
          <Button
            colorScheme='blue'
            type='submit'
            width='full'
            isDisabled={!agreedToTerms}
          >
            Sign Up
          </Button>
          <Text mt={2} textAlign='center'>
            Already have an account?{' '}
            <Link href='/login'>
              <Button variant='link' colorScheme='blue'>
                Login
              </Button>
            </Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
} 