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

export default function Orders() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  const fetchPurchaseHistory = async () => {
    try {
      const response = await fetch('/api/purchases');
      if (!response.ok) {
        throw new Error('Failed to fetch purchase history');
      }
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      console.error('Error fetching purchase history:', error);
    } finally {
      setLoading(false);
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
                Order #{purchase._id.slice(-6)}
              </Heading>
              <Text color="gray.500" fontSize="sm">
                {formatDate(purchase.purchaseDate)}
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
                              ${(item.productPrice * item.quantity).toFixed(2)}
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
                    ${calculateTotal(purchase.products)}
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
