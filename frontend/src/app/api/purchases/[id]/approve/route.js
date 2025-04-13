import { NextResponse } from 'next/server';
import { getDB } from '../../../../../lib/db';

export async function POST(req, { params }) {
  try {
    const db = await getDB();
    const { id } = params;

    // Get the purchase to update stock
    const purchase = await db.collection('purchases').findOne({ _id: id });
    
    // Update purchase status while preserving paymentStatus
    await db.collection('purchases').updateOne(
      { _id: id },
      { $set: { status: 'approved' } }
    );

    // Update product stock
    const stockUpdates = purchase.products.map(product => ({
      productId: product.product._id,
      quantity: product.quantity
    }));

    // Update stock quantities
    for (const update of stockUpdates) {
      await db.collection('products').updateOne(
        { _id: update.productId },
        { $inc: { stock: -update.quantity } }
      );
    }

    return NextResponse.json({ message: 'Purchase approved successfully' });
  } catch (error) {
    console.error('Error approving purchase:', error);
    return NextResponse.json({ error: 'Failed to approve purchase' }, { status: 500 });
  }
}