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
      const { name, description, price, quantity, image } = req.body;
      const newProduct = {
        name,
        description,
        price,
        quantity,
        image,
        createdAt: new Date(),
      };
      await db.collection('products').insertOne(newProduct);
      res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add product' });
    }
  }
  //Update Product
  if (req.method === 'PUT') {
    try {
      const { id, name, description, price, quantity, image } = req.body;
      const updatedProduct = {
        name,
        description,
        price,
        quantity,
        image,
      };
      await db
        .collection('products')
        .updateOne({ _id: new ObjectId(id) }, { $set: updatedProduct });
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
}
