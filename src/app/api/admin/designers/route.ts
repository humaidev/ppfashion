import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Designer from '@/models/Designer';

export async function GET() {
  try {
    await dbConnect();
    const designers = await Designer.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, designers });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const designer = await Designer.create(data);
    return NextResponse.json({ success: true, designer });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
