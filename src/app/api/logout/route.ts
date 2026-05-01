import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ 
    success: true, 
    message: 'Logged out successfully' 
  });

  // Clear the admin_token cookie
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0 // Expire immediately
  });

  // Clear the user_token cookie
  response.cookies.set('user_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0 // Expire immediately
  });

  return response;
}
