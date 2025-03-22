import { getDB } from '../../../../lib/db';
import { NextResponse } from 'next/server';
// import { store } from '../../src/app/redux/store';

export async function GET() {
  try {
    // const { MONGODB_DB } = process.env;
    // const client = await connectToDB();
    const db = await getDB();

    if (!db) {
      console.error('Database connection failed');
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const products = await db.collection('products').find({}).toArray();

    return NextResponse.json({ products }, { status: 200 });
    // res.status(200).json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const db = await getDB();
    const body = await req.json();
    const { name, description, price, quantity, image } = body;

    // Validate the data
    //require name, price, quantity
    // if (!name || !description || !price || !quantity) {
    //   return NextResponse.json(
    //     { error: 'Missing required fields' },
    //     { status: 400 }
    //   );
    // }

    const newProduct = {
      name,
      description,
      price: Number(price),
      quantity: Number(quantity),
      image,
      createdAt: new Date(),
    };

    await db.collection('products').insertOne(newProduct);
    return NextResponse.json(
      { message: 'Product added successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
}
//Update Product
// if (req.method === 'PUT') {
//   try {
//     const { id, name, description, price, quantity, image } = req.body;

//     const product = await db
//       .collection('products')
//       .findOne({ _id: new ObjectId(id) });

//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     const updatedProduct = {
//       name,
//       description,
//       price,
//       quantity,
//       image,
//     };

//     await db
//       .collection('products')
//       .updateOne({ _id: new ObjectId(id) }, { $set: updatedProduct });
//     res.status(200).json({ message: 'Product updated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update product' });
//   }
// }
