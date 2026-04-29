import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Hardcoded Admin Credentials for now
    // In a real app, you would check this against the database
    if (email === 'admin@ppfassion.com' && password === 'admin123') {
      const response = NextResponse.json({ 
        success: true, 
        message: 'Login successful' 
      });

      // Set a simple cookie to simulate session
      response.cookies.set('admin_token', 'secure_token_abc123', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      });

      return response;
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Invalid credentials' 
    }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: 'Server error' 
    }, { status: 500 });
  }
}
