import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    let user;
    try {
      user = verifyToken(token);
    } catch {
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 });
    }

    const isAdmin = user.role === 'admin';

    // ────────────────────────────────────────────
    // QUERY DE VENDAS + JOIN COM PACOTES + USUÁRIOS
    // ────────────────────────────────────────────
    let query = supabaseAdmin
      .from('vendas')
      .select(`
        id,
        valor,
        mesas,
        tipo,
        data,
        vendedor_id,
        pacote_id,
        pacotes ( nome_cliente ),
        usuarios ( nome )
      `)
      .order('data', { ascending: false });

    // Funcionário só vê as próprias vendas
    if (!isAdmin) {
      query = query.eq('vendedor_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
      return NextResponse.json({ error: 'Erro ao buscar vendas' }, { status: 500 });
    }

    return NextResponse.json({ vendas: data });

  } catch (error) {
    console.error('ERRO AO LISTAR VENDAS:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
