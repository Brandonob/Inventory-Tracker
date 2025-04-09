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
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/usersSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    debugger;

    const user = { userName, password };
    console.log('Sending login request with:', user);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('user logged in!', data);
        dispatch(setUser([data]));
        localStorage.setItem('user', JSON.stringify(data));
        router.push('/');
      } else {
        const errorData = await response.json();
        console.error('Error logging in:', errorData.error);
      }
    } catch (error) {
      console.error('Failed to login:', error);
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
        Login
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
          <Button colorScheme='blue' type='submit' width='full'>
            Login
          </Button>
          <Text mt={2} textAlign='center'>
            Don't have an account?{' '}
            <Link href='/signup'>
              <Button variant='link' colorScheme='blue'>
                Sign Up
              </Button>
            </Link>
          </Text>
        </VStack>
      </form>
    </Box>
  );
}
