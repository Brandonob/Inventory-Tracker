import { NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';

export async function POST(req) {
  try {
    const db = await getDB();

  const body = await req.json();

  if (!body) {  
    return NextResponse.json({ error: 'No body provided' }, { status: 400 });
  }

  const { customerName, cartId, products, total, paymentMethod, partialPaymentAmount, status } = body;

  if (!products || !total || !paymentMethod || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  } 

  const purchase = {
    customerName: customerName,
    cartId: cartId,
    products: products,
    total: total,
    paymentMethod: paymentMethod,
    partialPaymentAmount: partialPaymentAmount,
    status: status,
    createdAt: new Date(),
  };

  await db.collection('purchases').insertOne(purchase);

    return NextResponse.json({ message: 'Purchase created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json({ error: 'Failed to create purchase' }, { status: 500 });
  }
}
