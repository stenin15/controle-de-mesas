import { NextResponse } from 'next/server';

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ message: 'Logout realizado com sucesso' });

  response.cookies.delete('token');

  return response;
}



