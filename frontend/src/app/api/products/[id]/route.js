import { getDB } from '../../../../../lib/db';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  const db = await getDB();
  console.log('>>>Request Object<<<', req); // Log the entire request object
  const { id } = params; // Extract id from params object
  console.log('>>>ID<<<', id);

  try {
    const body = await req.json(); // Need to parse the JSON body
    const { name, description, price, quantity, image } = body;

    const product = await db
      .collection('products')
      .findOne({ _id: ObjectId.createFromHexString(id) });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updatedProduct = {
      name,
      description,
      price,
      quantity,
      image,
    };

    await db
      .collection('products')
      .updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: updatedProduct }
      );

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  const db = await getDB();
  const { id } = params; // Extract id from params object

  try {
    const product = await db
      .collection('products')
      .findOne({ _id: ObjectId.createFromHexString(id) });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
