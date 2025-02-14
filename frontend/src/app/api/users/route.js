import { getDB } from '../../../../lib/db';
import { NextResponse } from 'next/server';
// import { store } from '../../src/app/redux/store';
export async function GET(req) {
  try {
    const db = await getDB();
    const users = await db.collection('users').find({}).toArray();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const db = await getDB();
    const { userName, password } = req.body;
    console.log('THIS IS THE REQ BODY', req.body);

    console.log('userName', req.body['userName']);
    console.log('password', req.body['password']);

    debugger;
    if (!userName || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newUser = { userName, password, createdAt: new Date() };
    await db.collection('users').insertOne(newUser);
    res.status(201).json({ message: 'User added' });
  } catch (error) {
    console.log('Cant create user', error.message);
    return res.status(500).json({ error: 'Failed to create user' });
  }
}

// res.setHeader('Allow', ['GET', 'POST']);
// res.status(405).json({ message: 'Method not allowed' });
