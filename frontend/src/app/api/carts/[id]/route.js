import { getDB } from '../../../../../lib/db';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const db = await getDB();
    const objectId = new ObjectId(id);

    const cart = await db.collection('carts').deleteOne({ _id: objectId });
    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.log('ERROR IN DELETE CART', error.message);
    return NextResponse.json(
      { error: 'Failed to delete cart' },
      { status: 500 }
    );
  }
}
