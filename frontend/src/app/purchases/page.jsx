'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SimpleGrid,
  Badge,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  ButtonGroup,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPurchases } from '../redux/slices/purchaseSlice';
import Image from 'next/image';
import hb from '../components/media/hb.png';
import hbaby from '../components/media/hbaby.png';
import Link from 'next/link'; 
import Tilt from 'react-parallax-tilt';
import { NavMenu } from '../components/NavMenu';
import { CartModal } from '../components/CartModal';

export default function Purchases() {
  const dispatch = useDispatch();
  const { purchases, loading, error } = useSelector((state) => state.purchases);
  const user = useSelector(state => state.users.user);
  const activeCart = useSelector((state) => state.carts.activeCart);
  const toast = useToast();
  
  
  const [timeFilter, setTimeFilter] = useState('all');
  const [filteredPurchases, setFilteredPurchases] = useState({
    pendingPurchases: [],
    approvedPurchases: []
  });

  useEffect(() => {
    dispatch(fetchAllPurchases());
  }, []);

  useEffect(() => {
    if (!purchases) return;
    
    const now = new Date();
    // Filter purchases based on user role and ownership
    const userAccessFilter = user?.isAdmin 
      ? purchases // Admin sees all purchases
      : purchases.filter(purchase => purchase.ownerId === user?._id); // Non-admin sees only their purchases

    // Then filter by time
    const filtered = userAccessFilter.filter(purchase => {
      const purchaseDate = new Date(purchase.createdAt);
      switch (timeFilter) {
        case '24h':
          return (now - purchaseDate) <= 24 * 60 * 60 * 1000;
        case 'week':
          return (now - purchaseDate) <= 7 * 24 * 60 * 60 * 1000;
        case 'month':
          return (now - purchaseDate) <= 30 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });

    // Separate purchases into pending and approved
    setFilteredPurchases({
      pendingPurchases: filtered.filter(p => p.status === 'pending'),
      approvedPurchases: filtered.filter(p => p.status !== 'pending')
    });
  }, [purchases, timeFilter, user]);

  const handleApprove = async (purchaseId) => {
    debugger;
    try {
      const purchase = purchases.find(p => p._id === purchaseId);
      if (!purchase) return;

      const response = await fetch(`/api/purchases/${purchaseId}/approve`, {
        method: 'POST',
      });
      
      if (response.ok) {
        // Update product stock after approval
        await updateProductStock(purchase.products);
        dispatch(fetchAllPurchases());
        
        toast({
          title: 'Purchase Approved',
          description: 'Purchase has been approved and stock has been updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to approve purchase');
      }
    } catch (error) {
      console.error('Error approving purchase:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve purchase. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDecline = async (purchaseId) => {
    debugger;
    try {
      const response = await fetch(`/api/purchases/${purchaseId}/decline`, {
        method: 'POST',
      });
      if (response.ok) {
        dispatch(fetchAllPurchases());
        toast({
          title: 'Purchase Declined',
          description: 'Purchase has been declined successfully',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to decline purchase');
      }
    } catch (error) {
      console.error('Error declining purchase:', error);
      toast({
        title: 'Error',
        description: 'Failed to decline purchase. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateProductStock = async (products) => {
    try {
      const stockUpdates = products.map(product => ({
        productId: product.product._id,
        quantity: product.quantity
      }));

      const response = await fetch('/api/products/update-stock', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products: stockUpdates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      // You might want to add toast notification here
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTotal = (products) => {
    return products.reduce((sum, item) => 
      sum + (parseFloat(item.productPrice) * item.quantity), 0
    ).toFixed(2);
  };

  if (loading) {
    return (
      <Box p={5} display="flex" justifyContent="center">
        <Text color={'white'}>Loading purchase history...</Text>
      </Box>
    );
  }

  return(
  <Box 
    p={5}
    backgroundColor={'black'}
    minHeight={'100vh'}
  >
    <Box display="flex" justifyContent="center" mb={4}>
      <Link href="/">
        <Image src={hb} alt='logo' width={300} height={300} />
      </Link>
    </Box>
    <Heading color={'white'} mb={6}>
      {user?.isAdmin ? 'Purchase History' : 'My Purchase History'}
    </Heading>
    
    <ButtonGroup spacing={4} mb={6}>
      <Button
        colorScheme={timeFilter === '24h' ? 'blue' : 'gray'}
        onClick={() => setTimeFilter('24h')}
      >
        Last 24 Hours
      </Button>
      <Button
        colorScheme={timeFilter === 'week' ? 'blue' : 'gray'}
        onClick={() => setTimeFilter('week')}
      >
        Past Week
      </Button>
      <Button
        colorScheme={timeFilter === 'month' ? 'blue' : 'gray'}
        onClick={() => setTimeFilter('month')}
      >
        Past Month
      </Button>
      <Button
        colorScheme={timeFilter === 'all' ? 'blue' : 'gray'}
        onClick={() => setTimeFilter('all')}
      >
        All Time
      </Button>
    </ButtonGroup>

    {filteredPurchases.pendingPurchases.length > 0 && (
      <>
        <Heading color={'white'} mb={6}>
          {user?.isAdmin ? 'Pending Approvals' : 'Pending Purchases'}
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredPurchases.pendingPurchases.map((purchase) => (
            <Card key={purchase._id} boxShadow="md">
              <CardHeader display="flex" justifyContent="space-between">
                <div>
                  <Heading size="md">
                    Order: {purchase.customerName}
                  </Heading>
                  <Text color="gray.500" fontSize="sm">
                    {formatDate(purchase.createdAt)}
                  </Text>
                </div>
                <div className='flex justify-center items-center gap-2'>
                  <Badge colorScheme='red'>
                    {purchase.status}
                  </Badge>
                  <Badge colorScheme={
                    purchase.paymentStatus === 'partial' ? 'yellow' : 'green'
                  }>
                    {purchase.paymentStatus}
                  </Badge>
                </div>
              </CardHeader>
              <CardBody>
                <Accordion allowMultiple>
                  <AccordionItem border="none">
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        <Text fontWeight="bold">
                          {purchase.products.length} items
                        </Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                        <VStack align="stretch" spacing={3}>
                          {purchase.products.map((item, index) => (
                            <HStack key={index} justify="space-between">
                              <VStack align="start" spacing={0}>
                                <Text fontSize="sm">{`${item.product.name} - ${item.product.description}`}</Text>
                                <Text fontSize="xs" color="gray.500">
                                  Qty: {item.quantity}
                                </Text>
                              </VStack>
                              <Text fontSize="sm">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </Text>
                            </HStack>
                          ))}
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </CardBody>
                <Divider />
                <CardFooter>
                  {user?.isAdmin ? (
                    <ButtonGroup spacing={2}>
                      <Button colorScheme="green" onClick={() => handleApprove(purchase._id)}>
                        Approve
                      </Button>
                      <Button colorScheme="red" onClick={() => handleDecline(purchase._id)}>
                        Decline
                      </Button>
                    </ButtonGroup>
                  ) : (
                    <HStack justify="space-between" width="100%">
                      <Text>Total:</Text>
                      <Text fontWeight="bold">
                        ${purchase.total}
                      </Text>
                    </HStack>
                  )}
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        </>
      )}

      <Heading color={'white'} mb={6}>
        {user?.isAdmin ? 'All Approved Purchases' : 'My Approved Purchases'}
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {filteredPurchases.approvedPurchases.map((purchase) => (
          <Card key={purchase._id} boxShadow="md">
            <CardHeader display="flex" justifyContent="space-between">
              <div className=''>
                <Heading size="md">
                  Order: {purchase.customerName}
                  {/* #{purchase._id.slice(-6)} */}
                </Heading>
                <Text color="gray.500" fontSize="sm">
                  {formatDate(purchase.createdAt)}
                </Text>
              </div>
              <div className='flex justify-center items-center gap-2'>
                {/* <Badge colorScheme={
                  purchase.status === 'pending' ? 'red' :
                  purchase.status === 'approved' ? 'green' :
                  'gray'
                }>
                  {purchase.status}
                </Badge> */}
                <Badge colorScheme={
                  purchase.paymentStatus === 'partial' ? 'yellow' :
                  purchase.paymentStatus === 'paid' ? 'green' :
                  'gray'
                }>
                  {purchase.paymentStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              <Accordion allowMultiple>
                <AccordionItem border="none">
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      <Text fontWeight="bold">
                        {purchase.products.length} items
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                      <VStack align="stretch" spacing={3}>
                        {purchase.products.map((item, index) => (
                          <HStack key={index} justify="space-between">
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm">{`${item.product.name} - ${item.product.description}`}</Text>
                              <Text fontSize="xs" color="gray.500">
                                Qty: {item.quantity}
                              </Text>
                            </VStack>
                            <Text fontSize="sm">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </CardBody>
              <Divider />
              <CardFooter>
                <HStack justify="space-between" width="100%">
                  <Text>Total:</Text>
                  <Text fontWeight="bold">
                    ${purchase.total}
                  </Text>
                </HStack>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>
        <CartModal activeCart={activeCart || { products: [] }} />
        <NavMenu />
        <Tilt>
          <Box display="flex" justifyContent="center" mb={4}>
            <Link href="/">
              <Image src={hbaby} alt='logo' width={300} height={300} />
            </Link>
          </Box>
        </Tilt>
    </Box>
  );
}
