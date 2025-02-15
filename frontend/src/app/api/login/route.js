import { getDB } from '../../../../lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
// import { store } from '../../src/app/redux/store';

export async function POST(req) {
  const db = await getDB();
  try {
    const body = await req.json();
    const { userName, password } = body;
    console.log('Received login attempt for username:', userName);
    console.log('userName', userName);
    console.log('password from body', password);

    const user = await db.collection('users').findOne({ userName });
    console.log('user(route)', user);

    if (!user) {
      console.log('Login failed: User not found');
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    console.log('user password found', user.password);

    // const isMatch = await bcrypt.compare(password, user.password);
    // console.log('isMatch', isMatch);
    const isMatch = password === user.password;

    if (!isMatch) {
      console.log('Login failed: Password mismatch');
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    console.log('Login successful');
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// export async function POST(req) {
//   try {
//     const db = await getDB();
//     const { userName, password } = req.body;
//     console.log('userName', userName);
//     console.log('password', password);
//     debugger;
//     const user = await db
//       .collection('users')
//       .insertOne({ userName, password, createdAt: new Date() });
//     console.log('user', user);
//     return NextResponse.json(user, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to create user' },
//       { status: 500 }
//     );
//   }
// }
