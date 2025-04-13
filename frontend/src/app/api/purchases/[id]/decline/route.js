import { NextResponse } from 'next/server';
import { getDB } from '../../../../../lib/db';

export async function POST(req, { params }) {
  try {
    const db = await getDB();
    const { id } = params;

    await db.collection('purchases').updateOne(
      { _id: id },
      { $set: { status: 'declined' } }
    );

    return NextResponse.json({ message: 'Purchase declined successfully' });
  } catch (error) {
    console.error('Error declining purchase:', error);
    return NextResponse.json({ error: 'Failed to decline purchase' }, { status: 500 });
  }
}