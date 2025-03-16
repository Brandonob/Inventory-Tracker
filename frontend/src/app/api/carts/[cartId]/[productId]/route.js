import { NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';
import { ObjectId } from 'mongodb';
export async function PATCH(req, { params }) {
  try {
    const { cartId, productId } = params;
    const cartData = await req.json();
    const db = await getDB();

    if (cartData.method === 'UPDATE') {
    const cart = await db.collection('carts').findOne({ _id: new ObjectId(cartId) });
    //find product in cart
    const product = cart.products.find((product) => product.productId === new ObjectId(productId));
    //update product quantity 
    product.quantity = cartData.quantity;
    //update cart
    const updatedCart = await db.collection('carts').updateOne({ _id: new ObjectId(cartId) }, { $set: { products: cart.products } });
    
    if (!updatedCart) {
      return NextResponse.json(
        { error: 'Failed to update cart product' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedCart, { status: 200 });
    
  } else if (cartData.method === 'DELETE') {
    //find product in cart by id and remove it from cart
    const updatedCart = await db.collection('carts').updateOne({ _id: new ObjectId(cartId) }, { $pull: { products: { productId: new ObjectId(productId) } } });

    if (!updatedCart) {
      return NextResponse.json(
        { error: 'Failed to delete cart product' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedCart, { status: 200 });
  }

  } catch (error) {
    console.error('Error updating cart product:', error);
    return NextResponse.json(
      { error: 'Failed to update cart product' },
      { status: 500 }
    );
  }
} 