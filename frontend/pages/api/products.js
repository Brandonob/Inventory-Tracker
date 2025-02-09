import { connectToDB } from '../../lib/db';

export default async function handler(req, res) {
  const { db } = await connectToDB();

  if (req.method === 'GET') {
    try {
      const products = await db.collection('products').find({}).toArray();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, price, description } = req.body;
      const newProduct = { name, price, description };
      await db.collection('products').insertOne(newProduct);
      res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add product' });
    }
  }
}
