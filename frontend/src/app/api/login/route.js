import { getDB } from '../../../../lib/db';
import { NextResponse } from 'next/server';
// import { store } from '../../src/app/redux/store';

export async function GET(req) {
  const db = await getDB();

  try {
    const { userName, password } = req.body;
    console.log('userName', userName);
    console.log('password', password);
    debugger;

    const user = await db.collection('users').findOne({ userName, password });
    console.log('user', user);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    //   const isMatch = await bcrypt.compare(password, user.password);
    //   if (!isMatch) {
    //     return new Response(
    //       JSON.stringify({ message: 'Invalid credentials' }),
    //       {
    //         status: 401,
    //       }
    //     );
    //   }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const db = await getDB();
    const { userName, password } = req.body;
    console.log('userName', userName);
    console.log('password', password);
    debugger;
    const user = await db
      .collection('users')
      .insertOne({ userName, password, createdAt: new Date() });
    console.log('user', user);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
