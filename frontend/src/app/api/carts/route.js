import { NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const db = await getDB();
    const body = await req.json();
    const { cartName, activeCartData } = body;
    //create a new cart
    const newCartData = {
      cartName,
      products: activeCartData,
      purchaseStatus: 'pending',
      isActiveCart: false,
      createdAt: new Date(),
    };

    const cart = await db.collection('carts').insertOne(newCartData);
    if (!cart) {
      return NextResponse.json({ error: 'Cart not created' }, { status: 404 });
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.log('ERROR IN POST CART', error.message);
    return NextResponse.json(
      { error: 'Failed to create cart' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDB();
    const carts = await db.collection('carts').find({}).toArray();
    return NextResponse.json(carts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch carts' },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const db = await getDB();
    const body = await req.json();
    const { cartId, activeCartData } = body;

    const objectId = new ObjectId(cartId);

    const cart = await db.collection('carts').findOne({ _id: objectId });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    cart.products = activeCartData;
    await db
      .collection('carts')
      .updateOne({ _id: objectId }, { $set: { products: activeCartData } });
    //return the cart with the new product
    const updatedCart = await db.collection('carts').findOne({ _id: objectId });
    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error) {
    console.log('ERROR IN PATCH CART', error.message);
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const db = await getDB();
    const body = await req.json();
    const { cartId } = body;
    const objectId = new ObjectId(cartId);
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
