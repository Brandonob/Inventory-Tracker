import { getDB } from '../../../../lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const db = await getDB();
    const { userName, password, phoneNumber } = await req.json();
    const existingUser = await db.collection('users').findOne({ userName: userName });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        userName,
        password: hashedPassword,
        phoneNumber,
        isAdmin: false,
        createdAt: new Date()
      };
      
      const result = await db.collection('users').insertOne(newUser);

      if (result.acknowledged) {  
        const { password: _, ...userWithoutPassword } = newUser;
        console.log('New user created');
        return NextResponse.json(userWithoutPassword, { status: 201 });
      } else {
        console.log('Failed to create user');
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Error in signup route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}