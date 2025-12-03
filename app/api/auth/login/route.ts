import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, generateToken, UserPayload } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  console.log('='.repeat(50));
  console.log('🔵 API /api/auth/login CHAMADA');
  console.log('='.repeat(50));

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      // opcional: logar se usuário existe
      const { data: usuarioExiste } = await supabaseAdmin
        .from('usuarios')
        .select('id, email')
        .eq('email', email)
        .single();

      console.log(
        usuarioExiste
          ? '⚠️ Usuário existe, mas senha incorreta'
          : '⚠️ Usuário não existe'
      );

      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const token = generateToken(user as UserPayload);

    const response = NextResponse.json({
      message: 'Login realizado com sucesso',
      user,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error: any) {
    console.error('🔴 ERRO CRÍTICO NO LOGIN:', error?.message);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
      },
      { status: 500 }
    );
  }
}
