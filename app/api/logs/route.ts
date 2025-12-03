import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyToken } from '@/lib/auth';

export const runtime = "nodejs";

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

    // Apenas admin pode ver logs
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Apenas admin pode visualizar logs' }, { status: 403 });
    }

    // ────────────────────────────────────────────
    // BUSCAR LOGS + JOIN COM USUÁRIOS
    // ────────────────────────────────────────────
    const { data, error } = await supabaseAdmin
      .from('logs')
      .select(`
        id,
        acao,
        detalhes,
        timestamp,
        usuarios ( nome )
      `)
      .order('timestamp', { ascending: false })
      .limit(200);

    if (error) throw error;

    return NextResponse.json({ logs: data });

  } catch (error) {
    console.error('ERRO AO BUSCAR LOGS:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
