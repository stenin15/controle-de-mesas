import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { user: null, error: 'Não autenticado' },
      { status: 401 }
    );
  }

  try {
    const user = verifyToken(token);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { user: null, error: 'Token inválido ou expirado' },
      { status: 401 }
    );
  }
}



