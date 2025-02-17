import { NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';

export async function POST(req) {
  const db = await getDB();
  const body = await req.json();
  const { cartData } = body;

  try {
    const product = await db.collection('products').findOne({ _id: productId });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
