import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyToken } from '@/lib/auth';

// GET → Busca estoque atual (admin + funcionário)
export async function GET(request: NextRequest) {
  try {
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

    const { data: estoque, error } = await supabaseAdmin
      .from('estoque')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !estoque) {
      return NextResponse.json({ error: 'Estoque não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ estoque });
  } catch (error) {
    console.error('ERRO AO BUSCAR ESTOQUE:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// PUT → Atualizar estoque total (somente admin)
export async function PUT(request: NextRequest) {
  try {
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

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Apenas admin pode alterar o estoque' }, { status: 403 });
    }

    const { total_mesas } = await request.json();

    if (!total_mesas || total_mesas < 0) {
      return NextResponse.json({ error: 'Total inválido' }, { status: 400 });
    }

    // Atualiza estoque
    const { error: updateErr } = await supabaseAdmin
      .from('estoque')
      .update({ total_mesas })
      .eq('id', 1);

    if (updateErr) {
      console.error(updateErr);
      return NextResponse.json({ error: 'Erro ao atualizar estoque' }, { status: 500 });
    }

    // LOG DE AUDITORIA
    await supabaseAdmin.from('logs').insert({
      usuario_id: user.id,
      acao: 'atualizar_estoque',
      detalhes: { total_mesas },
    });

    return NextResponse.json({
      message: 'Estoque atualizado com sucesso',
      total_mesas,
    });

  } catch (error) {
    console.error('ERRO ATUALIZAR ESTOQUE:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
