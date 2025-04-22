import { getDB } from '../../../../../lib/db';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  try {
    debugger;
    const { cartId } = params;
    console.log('PARAMSSSSS', cartId);
    
    const db = await getDB();

    const cart = await db.collection('carts').deleteOne({ _id: new ObjectId(cartId) });
    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.log('ERROR IN DELETE CART', error.message);
    return NextResponse.json(
      { error: 'Failed to delete cart' },
      { status: 500 }
    );
  }
} 

export async function PATCH(req, { params }) {
  try {
    const { cartId } = params;
    const db = await getDB();
    const body = await req.json();

    const { isActiveCart } = body;

    const cart = await db
      .collection('carts')
      .updateOne(
        { _id: new ObjectId(cartId) }, 
        { $set: { isActiveCart } }
      );

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.log('ERROR IN PATCH CART', error.message);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
