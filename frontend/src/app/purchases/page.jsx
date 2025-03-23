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
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPurchases } from '../redux/slices/purchaseSlice';

export default function Purchases() {
  const dispatch = useDispatch();
  const { purchases, loading, error } = useSelector((state) => state.purchases);
  console.log('purchases', purchases);

  useEffect(() => {
    dispatch(fetchAllPurchases());
  }, []);

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
        <Text>Loading purchase history...</Text>
      </Box>
    );
  }
  return(
  <Box p={5}>
    <Heading mb={6}>Purchase History</Heading>
    {purchases.length === 0 ? (
      <Text>No purchase history available</Text>
    ) : (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {purchases.map((purchase) => (
          <Card key={purchase._id} boxShadow="md">
            <CardHeader>
              <Heading size="md">
                Order: {purchase.customerName}
                {/* #{purchase._id.slice(-6)} */}
              </Heading>
              <Text color="gray.500" fontSize="sm">
                {formatDate(purchase.createdAt)}
              </Text>
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
                              <Text fontSize="sm">{item.productName}</Text>
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
      )}
    </Box>
  );
}
