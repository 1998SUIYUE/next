import { NextResponse } from 'next/server';
import orderCounter from '@/app/lib/dailycounter';

export async function POST() {
  try {
    const newCount = orderCounter.incrementCount();
    return NextResponse.json({ count: newCount });
  } catch (error) {
    console.error('Error updating order count:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  const count = orderCounter.getCount();
  return NextResponse.json({ count });
}
