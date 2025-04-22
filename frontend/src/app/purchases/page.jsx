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
import { PurchasesLoadingState } from '../components/LoadingStates/PurchasesLoadingState';

export default function Purchases() {
  const [pageLoading, setPageLoading] = useState(true);
  const dispatch = useDispatch();
  const { purchases, loading, error } = useSelector((state) => state.purchases);
  const user = useSelector(state => state.users.user);
  const activeCart = useSelector((state) => state.carts.activeCart);
  const toast = useToast();
  
  
  const [timeFilter, setTimeFilter] = useState('all');
  const [filteredPurchases, setFilteredPurchases] = useState({
    pendingPurchases: [],
    approvedPurchases: [],
    completedPurchases: []
  });

  useEffect(() => {
    dispatch(fetchAllPurchases());
  }, []);

  useEffect(() => {
    if (!purchases) return;
    
    const now = new Date();
    const userAccessFilter = user?.isAdmin 
      ? purchases
      : purchases.filter(purchase => purchase.ownerId === user?._id);

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

    setFilteredPurchases({
      pendingPurchases: filtered.filter(p => p.status === 'pending'),
      approvedPurchases: filtered.filter(p => p.status === 'approved'),
      completedPurchases: filtered.filter(p => p.status === 'complete' || p.status === 'declined')
    });
  }, [purchases, timeFilter, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleApprove = async (purchaseId) => {
    debugger;
    try {
      const purchase = purchases.find(p => p._id === purchaseId);
      if (!purchase) return;

      const response = await fetch(`/api/purchases/${purchaseId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvedAt: new Date().toISOString()
        }),
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          declinedAt: new Date().toISOString()
        }),
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

  const handleComplete = async (purchase) => {
    debugger;
    try {
      if (purchase.paymentStatus === 'partial') {
        const isConfirmed = window.confirm(
          'This purchase was partially paid. Has the remaining balance been paid in full?'
        );
        
        if (!isConfirmed) {
          toast({
            title: 'Action Cancelled',
            description: 'Purchase was not marked as complete',
            status: 'info',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      }

      const response = await fetch(`/api/purchases/${purchase._id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentStatus: 'paid',
          status: 'complete',
          completedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        dispatch(fetchAllPurchases());
        toast({
          title: 'Purchase Completed',
          description: 'Purchase has been marked as complete',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to complete purchase');
      }
    } catch (error) {
      console.error('Error completing purchase:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete purchase. Please try again.',
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

  if (loading || pageLoading) {
    return <PurchasesLoadingState />;
  }

  return(
  <div className='flex flex-col items-center justify-center bg-white dark:bg-black min-h-screen transition-colors duration-200'>
    <div className='flex items-center justify-center'>
      <Link href="/">
        <Image src={hb} alt='logo' width={300} height={300} />
      </Link>
    </div>
    <div className='w-[90%] mx-auto'>
      <Heading mb={6} className='text-black dark:text-white transition-colors duration-200'>
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
          <Heading mb={6} mt={6} className='text-black dark:text-white transition-colors duration-200'>
            {user?.isAdmin ? 'Pending Approvals' : 'Pending Purchases'}
          </Heading>
          <SimpleGrid 
            className='border-black dark:border-white'
            border={'1px solid'} 
            padding={'16px'} 
            borderRadius={'6px'} 
            columns={{ base: 1, md: 2, lg: 3 }} 
            spacing={6}
          >
            {filteredPurchases.pendingPurchases.map((purchase) => (
              <Card 
                key={purchase._id} 
                boxShadow="md"
                className='bg-white dark:bg-gray-800 transition-colors duration-200'
              >
                <CardHeader>
                  <div>
                    <Heading size="md" className='text-black dark:text-white transition-colors duration-200'>
                      Order: {purchase.customerName}
                    </Heading>
                    <Text className='text-gray-500 dark:text-gray-400 transition-colors duration-200'>
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
                          <Text fontWeight="bold" className='text-black dark:text-white transition-colors duration-200'>
                            {purchase.products.length} items
                          </Text>
                        </Box>
                        <AccordionIcon className='text-black dark:text-white'/>
                      </AccordionButton>
                      <AccordionPanel>
                          <VStack align="stretch" spacing={3}>
                            {purchase.products.map((item, index) => (
                              <HStack key={index} justify="space-between">
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="sm" className='text-black dark:text-white transition-colors duration-200'>{`${item.product.name} - ${item.product.description}`}</Text>
                                  <Text fontSize="xs" className='text-black dark:text-white transition-colors duration-200'>
                                    Qty: {item.quantity}
                                  </Text>
                                </VStack>
                                <Text fontSize="sm" className='text-black dark:text-white transition-colors duration-200'>
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
                        <Text className='text-black dark:text-white transition-colors duration-200'>Total:</Text>
                        <Text fontWeight="bold" className='text-black dark:text-white transition-colors duration-200'>
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

        {filteredPurchases.approvedPurchases.length > 0 && (
          <>
            <Heading mb={6} mt={6} className='text-black dark:text-white transition-colors duration-200'>
              {user?.isAdmin ? 'Approved Purchases' : 'My Approved Purchases'}
            </Heading>
            <SimpleGrid 
              className='border-black dark:border-white'
              border={'1px solid'}
              padding={'16px'} 
              borderRadius={'6px'} 
              columns={{ base: 1, md: 2, lg: 3 }} 
              spacing={6}
            >
              {filteredPurchases.approvedPurchases.map((purchase) => (
                <Card 
                  key={purchase._id} 
                  boxShadow="md"
                  className='bg-white dark:bg-gray-800 transition-colors duration-200'
                >
                  <CardHeader>
                    <div className=''>
                      <Heading size="md" className='text-black dark:text-white transition-colors duration-200'>
                        Order: {purchase.customerName}
                      </Heading>
                      <Text className='text-gray-500 dark:text-gray-400 transition-colors duration-200'>
                        {formatDate(purchase.createdAt)}
                      </Text>
                    </div>
                    <div className='flex justify-center items-center gap-2'>
                      <Badge colorScheme={
                        purchase.status === 'pending' ? 'red' :
                        purchase.status === 'approved' ? 'green' :
                        'red'
                      }>
                        {purchase.status}
                      </Badge>
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
                            <Text fontWeight="bold" className='text-black dark:text-white transition-colors duration-200'>
                              {purchase.products.length} items
                            </Text>
                          </Box>
                          <AccordionIcon className='text-black dark:text-white'/>
                        </AccordionButton>
                        <AccordionPanel>
                            <VStack align="stretch" spacing={3}>
                              {purchase.products.map((item, index) => (
                                <HStack key={index} justify="space-between">
                                  <VStack align="start" spacing={0}>
                                    <Text fontSize="sm" className='text-black dark:text-white transition-colors duration-200'>{`${item.product.name} - ${item.product.description}`}</Text>
                                    <Text fontSize="xs" className='text-black dark:text-white transition-colors duration-200'>
                                      Qty: {item.quantity}
                                    </Text>
                                  </VStack>
                                  <Text fontSize="sm" className='text-black dark:text-white transition-colors duration-200'>
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
                        <Text className='text-black dark:text-white transition-colors duration-200'>Total: ${purchase.total}</Text>
                        {user?.isAdmin && (
                          <Button
                            colorScheme="green"
                            onClick={() => handleComplete(purchase)}
                          >
                            Mark Complete
                          </Button>
                        )}
                      </HStack>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            </>
          )}

        {filteredPurchases.completedPurchases.length > 0 && (
          <>
            <Heading mb={6} mt={6} className='text-black dark:text-white transition-colors duration-200'>
              {user?.isAdmin ? 'Completed Purchases' : 'My Completed Purchases'}
            </Heading>
            <SimpleGrid 
              className='border-black dark:border-white'
              border={'1px solid'}
              padding={'16px'} 
              borderRadius={'6px'} 
              columns={{ base: 1, md: 2, lg: 3 }} 
              spacing={6}
            >
              {filteredPurchases.completedPurchases.map((purchase) => (
                <Card 
                  key={purchase._id} 
                  boxShadow="md"
                  className='bg-white dark:bg-gray-800 transition-colors duration-200'
                >
                  <CardHeader>
                    <div className=''>
                      <Heading size="md" className='text-black dark:text-white transition-colors duration-200'>
                        Order: {purchase.customerName}
                      </Heading>
                      <Text className='text-gray-500 dark:text-gray-400 transition-colors duration-200'>
                        {formatDate(purchase.createdAt)}
                      </Text>
                    </div>
                    <div className='flex justify-center items-center gap-2'>
                      <Badge colorScheme={
                        purchase.status === 'pending' ? 'red' :
                        purchase.status === 'approved' ? 'green' :
                        purchase.status === 'complete' ? 'green': 
                        'red'
                      }>
                        {purchase.status}
                      </Badge>
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
                            <Text fontWeight="bold" className='text-black dark:text-white transition-colors duration-200'>
                              {purchase.products.length} items
                            </Text>
                          </Box>
                          <AccordionIcon className='text-black dark:text-white'/>
                        </AccordionButton>
                        <AccordionPanel>
                            <VStack align="stretch" spacing={3}>
                              {purchase.products.map((item, index) => (
                                <HStack key={index} justify="space-between">
                                  <VStack align="start" spacing={0}>
                                    <Text fontSize="sm" className='text-black dark:text-white transition-colors duration-200'>{`${item.product.name} - ${item.product.description}`}</Text>
                                    <Text fontSize="xs" className='text-black dark:text-white transition-colors duration-200'>
                                      Qty: {item.quantity}
                                    </Text>
                                  </VStack>
                                  <Text fontSize="sm" className='text-black dark:text-white transition-colors duration-200'>
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
                        <Text className='text-black dark:text-white transition-colors duration-200'>Total: ${purchase.total}</Text>
                      </HStack>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            </>
          )}

        <CartModal activeCart={activeCart || { products: [] }} />
        <NavMenu />
        <Tilt>
          <Box display="flex" justifyContent="center" mb={4}>
            <Link href="/">
              <Image src={hbaby} alt='logo' width={300} height={300} />
            </Link>
          </Box>
        </Tilt>
    </div>
    </div>
  );
}
