// const API_URL = process.env.PUBLIC_API_URL || process.env.LOCAL_API_URL;
//Users
const getAllUsers = () => {};

const getUserByUserName = () => {};

//Products
const getAllProducts = async () => {
  try {
    debugger;
    const response = await fetch('/api/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const products = await response.json();
      console.log('All Products:', products);
      return products;
    } else {
      throw new Error('Failed to fetch products');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

const addProduct = async (product) => {
  try {
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
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

module.exports = { getAllProducts, addProduct };
