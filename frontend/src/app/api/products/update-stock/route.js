import { NextResponse } from 'next/server';
import { getDB } from '../../../../../lib/db';
import { ObjectId } from 'mongodb';

export async function PATCH(req) {
  try {
    const db = await getDB();
    const { products } = await req.json();

    // Update stock for each product
    const updates = await Promise.all(
      products.map(async ({ productId, quantity }) => {
        const product = await db.collection('products').findOneAndUpdate(
          { _id: new ObjectId(productId) },
          { $inc: { quantity: -parseInt(quantity) } },
          { returnDocument: 'after' }
        );
        return product;
      })
    );

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
