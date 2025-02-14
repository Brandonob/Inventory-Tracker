import { NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';

export async function GET() {
  try {
    const db = await getDB();

    await db.admin().ping(); // Test the connection
    return NextResponse.json({ status: 'connected' });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 500 }
    );
  }
}
