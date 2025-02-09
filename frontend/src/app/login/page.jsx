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
} from '@chakra-ui/react';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    debugger;
    // console.log('Login Data:', formData);
    // Handle login logic here
    const user = { userName: userName, password: password };
    const formData = new FormData();
    formData.append('user', user);

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      console.log('user created!');
    } else {
      const errorData = await response.json();
      console.log('Error creating user:', errorData);
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
        </VStack>
      </form>
    </Box>
  );
}
