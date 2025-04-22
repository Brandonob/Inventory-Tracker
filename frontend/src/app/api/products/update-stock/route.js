import { NextResponse } from 'next/server';
import { getDB } from '../../../../../lib/db';
import { ObjectId } from 'mongodb';

export async function PATCH(req) {
  try {
    const db = await getDB();
    const { products } = await req.json();

    console.log('Received products:', products);

    // Update stock for each product
    const updates = await Promise.all(
      products.map(async ({ productId, quantity }) => {
        if (!productId || !quantity) {
          throw new Error('Invalid product data');
        }
        
        const quantityNum = parseInt(quantity);
        if (isNaN(quantityNum)) {
          throw new Error('Invalid quantity value');
        }

        const product = await db.collection('products').findOneAndUpdate(
          { _id: new ObjectId(productId) },
          { $inc: { quantity: -quantityNum } },
          { returnDocument: 'after' }
        );
        return product;
      })
    );

    console.log('Stock updates being sent:', updates);

    return NextResponse.json({ 
      message: 'Stock updated successfully', 
      updates 
    });

  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { error: 'Failed to update stock' }, 
      { status: 500 }
    );
  }
}
