import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');

    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Ignore if exists
    }

    const path = join(uploadDir, filename);
    await writeFile(path, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({ 
      success: true, 
      url: publicUrl 
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
  }
}
