import { NextResponse } from 'next/server';
import { getDB } from '../../../../../../lib/db';
import { ObjectId } from 'mongodb';

export async function POST(req, { params }) {
  try {
    const db = await getDB();
    const { id } = params;
    const { approvedAt } = await req.json();
    
    await db.collection('purchases').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'approved',
          approvedAt: approvedAt
        } 
      }
    );

    return NextResponse.json({ message: 'Purchase approved successfully' });
  } catch (error) {
    console.error('Error approving purchase:', error);
    return NextResponse.json({ error: 'Failed to approve purchase' }, { status: 500 });
  }
}