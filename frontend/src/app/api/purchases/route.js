import { NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const db = await getDB();

    const body = await req.json();

    if (!body) {  
      return NextResponse.json({ error: 'No body provided' }, { status: 400 });
    }

    const { 
      customerName, 
      cartId, 
      products, 
      total, 
      paymentMethod, 
      partialPaymentAmount, 
      status, 
      paymentStatus,
      ownerId
    } = body;

    if (!products || !total || !paymentMethod || !status || !paymentStatus) {
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
      paymentStatus: paymentStatus,
      ownerId: new ObjectId(ownerId),
      createdAt: new Date(),
    };

    await db.collection('purchases').insertOne(purchase);

    return NextResponse.json({ message: 'Purchase created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json({ error: 'Failed to create purchase' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const db = await getDB();
    if (!db) {
      console.error('Database connection failed');
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    } 

    const purchases = await db.collection('purchases').find({}).toArray();

    return NextResponse.json({ purchases }, { status: 200 });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases' }, 
      { status: 500 });
  }
}
