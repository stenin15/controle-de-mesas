import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyToken } from '@/lib/auth';

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
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

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Apenas admin pode fazer estorno' }, { status: 403 });
    }

    // Inputs do estorno
    const { id_pacote, qtd_estornar, valor_estornar } = await request.json();

    if (!id_pacote || !qtd_estornar || !valor_estornar) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // ────────────────────────────────────────────
    // 1. Buscar pacote
    // ────────────────────────────────────────────
    const { data: pacote, error: pacoteError } = await supabaseAdmin
      .from('pacotes')
      .select('*')
      .eq('id', id_pacote)
      .single();

    if (pacoteError || !pacote) {
      return NextResponse.json({ error: 'Pacote não encontrado' }, { status: 404 });
    }

    // ────────────────────────────────────────────
    // 2. Validar estorno possível
    // ────────────────────────────────────────────
    const restantes = pacote.qtd_mesas_compradas - pacote.qtd_mesas_usadas;

    if (qtd_estornar > restantes) {
      return NextResponse.json(
        { error: 'Quantidade para estornar maior do que mesas restantes' },
        { status: 400 }
      );
    }

    // ────────────────────────────────────────────
    // 3. Atualizar pacote
    // ────────────────────────────────────────────
    const novoTotal = pacote.qtd_mesas_compradas - qtd_estornar;

    const { error: updatePacoteErr } = await supabaseAdmin
      .from('pacotes')
      .update({
        qtd_mesas_compradas: novoTotal,
      })
      .eq('id', id_pacote);

    if (updatePacoteErr) throw updatePacoteErr;

    // ────────────────────────────────────────────
    // 4. Registro de estorno no financeiro
    // ────────────────────────────────────────────
    const { error: vendaErr } = await supabaseAdmin
      .from('vendas')
      .insert({
        pacote_id: id_pacote,
        valor: -Math.abs(valor_estornar), // sempre negativo
        mesas: -Math.abs(qtd_estornar),
        vendedor_id: user.id,
        tipo: 'estorno',
      });

    if (vendaErr) throw vendaErr;

    // ────────────────────────────────────────────
    // 5. Registrar log
    // ────────────────────────────────────────────
    await supabaseAdmin.from('logs').insert({
      usuario_id: user.id,
      acao: 'estorno',
      pacote_id: id_pacote,
      detalhes: {
        qtd_estornada: qtd_estornar,
        valor_estornado: valor_estornar,
        novo_total_mesas_pacote: novoTotal,
      },
    });

    // ────────────────────────────────────────────
    // 6. Resposta
    // ────────────────────────────────────────────
    return NextResponse.json({
      message: 'Estorno realizado com sucesso',
      novo_total_mesas_pacote: novoTotal,
    });

  } catch (error) {
    console.error('ERRO AO FAZER ESTORNO:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
