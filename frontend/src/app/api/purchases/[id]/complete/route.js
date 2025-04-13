import { NextResponse } from 'next/server';
import { getDB } from '../../../../../../lib/db';
import { ObjectId } from 'mongodb';

export async function POST(req, { params }) {
  try {
    const db = await getDB();
    const { id } = params;
    const { paymentStatus, status, completedAt } = await req.json();

    await db.collection('purchases').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: status,
          paymentStatus: paymentStatus,
          completedAt: completedAt
        } 
      }
    );

    return NextResponse.json({ message: 'Purchase completed successfully' });
  } catch (error) {
    console.error('Error completing purchase:', error);
    return NextResponse.json({ error: 'Failed to complete purchase' }, { status: 500 });
  }
}