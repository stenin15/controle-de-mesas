import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  console.log('🔵 [API /auth/me] Requisição recebida');
  
  const token = request.cookies.get('token')?.value;
  
  console.log('🔵 [API /auth/me] Token encontrado?', !!token);
  console.log('🔵 [API /auth/me] Todos os cookies:', request.cookies.getAll().map(c => c.name));

  if (!token) {
    console.log('🔴 [API /auth/me] Token não encontrado - retornando 401');
    return NextResponse.json(
      { user: null, error: 'Não autenticado' },
      { status: 401 }
    );
  }

  console.log('🔵 [API /auth/me] Verificando token...');
  const user = verifyToken(token);

  if (!user) {
    console.log('🔴 [API /auth/me] Token inválido ou expirado - retornando 401');
    return NextResponse.json(
      { user: null, error: 'Token inválido ou expirado' },
      { status: 401 }
    );
  }

  console.log('✅ [API /auth/me] Token válido - retornando usuário:', {
    id: user.id,
    email: user.email,
    role: user.role,
    nome: user.nome
  });

  return NextResponse.json({ user });
}



