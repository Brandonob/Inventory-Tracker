import { connectToDB } from '../../../../lib/db';
import { ObjectId } from 'mongodb';
import { store } from '../../redux/store';
export default async function handler(req, res) {
  const { db } = await connectToDB();
  const { id } = req.query; // Get the ID from the URL

  if (req.method === 'PUT') {
    try {
      const { name, description, price, quantity, image } = req.body;

      const product = await db
        .collection('products')
        .findOne({ _id: ObjectId.createFromHexString(id) });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const updatedProduct = {
        name,
        description,
        price,
        quantity,
        image,
      };

      await db
        .collection('products')
        .updateOne(
          { _id: ObjectId.createFromHexString(id) },
          { $set: updatedProduct }
        );

      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  }

  // Optionally add GET method to fetch single product
  if (req.method === 'GET') {
    try {
      const product = await db
        .collection('products')
        .findOne({ _id: ObjectId.createFromHexString(id) });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }
}
