import { getDB } from '../../../../lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
// import { store } from '../../src/app/redux/store';

export async function POST(req) {
  try {
    const db = await getDB();
    const { userName, password } = await req.json();
    console.log('Received login attempt for username:', userName);

    const existingUser = await db.collection('users').findOne({ userName });

    // If user doesn't exist, create new user
    // if (!existingUser) {
    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   const newUser = {
    //     userName,
    //     password: hashedPassword,
    //     createdAt: new Date()
    //   };
      
    //   const result = await db.collection('users').insertOne(newUser);

    //   if (result.acknowledged) {  
    //     const { password: _, ...userWithoutPassword } = newUser;
    //     console.log('New user created');
    //     return NextResponse.json(userWithoutPassword, { status: 201 });
    //   } else {
    //     console.log('Failed to create user');
    //     return NextResponse.json(
    //       { error: 'Failed to create user' },
    //       { status: 500 }
    //     );
    //   }
    // }

    // Existing login logic for returning users
    const isValidPassword = await bcrypt.compare(password, existingUser.password);
    
    if (!isValidPassword) {
      console.log('Login failed: Password mismatch');
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = existingUser;
    console.log('Login successful');
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate user' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const db = await getDB();
    const { userName } = req.body;
    console.log('userName', userName);
    
    const user = await db.collection('users').findOne({ userName });
    console.log('user', user);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
