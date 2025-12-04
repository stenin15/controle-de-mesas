import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 });
    }

    const { id_pacote, acao } = await request.json();

    if (!id_pacote || !acao) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    // ─────────────────────────────────────
    // 1) BUSCAR PACOTE
    // ─────────────────────────────────────
    const { data: pacote, error: pacoteError } = await supabaseAdmin
      .from('pacotes')
      .select('*')
      .eq('id', id_pacote)
      .single();

    if (pacoteError || !pacote) {
      return NextResponse.json({ error: 'Pacote não encontrado' }, { status: 404 });
    }

    // ─────────────────────────────────────
    // 2) VERIFICAR SE AINDA TEM MESAS DISPONÍVEIS
    // ─────────────────────────────────────
    const restantes = pacote.qtd_mesas_compradas - pacote.qtd_mesas_usadas;

    if (restantes <= 0) {
      return NextResponse.json(
        { error: 'Todas as mesas já foram entregues para este QR.' },
        { status: 400 }
      );
    }

    // ─────────────────────────────────────
    // 3) DETERMINAR QUANTAS MESAS ENTREGAR
    // ─────────────────────────────────────
    let entregarAgora = 0;

    if (acao === '1mesa') {
      entregarAgora = 1;
    } else if (acao === 'todas') {
      entregarAgora = restantes;
    } else {
      return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }

    // ─────────────────────────────────────
    // 4) ATUALIZAR PACOTE
    // ─────────────────────────────────────
    const { error: updatePacoteErr } = await supabaseAdmin
      .from('pacotes')
      .update({
        qtd_mesas_usadas: pacote.qtd_mesas_usadas + entregarAgora,
      })
      .eq('id', id_pacote);

    if (updatePacoteErr) throw updatePacoteErr;

    // ─────────────────────────────────────
    // 5) VERIFICAR E ATUALIZAR ESTOQUE GERAL
    // ─────────────────────────────────────
    const { data: estoque, error: estoqueErr } = await supabaseAdmin
      .from('estoque')
      .select('*')
      .eq('id', 1)
      .single();

    if (estoqueErr || !estoque) {
      return NextResponse.json({ error: 'Estoque não encontrado' }, { status: 500 });
    }

    // Validar se há mesas disponíveis no estoque
    const mesasDisponiveisNoEstoque = estoque.total_mesas - estoque.mesas_entregues;

    if (entregarAgora > mesasDisponiveisNoEstoque) {
      return NextResponse.json(
        { error: `Não há mesas suficientes no estoque. Disponível: ${mesasDisponiveisNoEstoque}` },
        { status: 400 }
      );
    }

    const { error: updateEstoqueErr } = await supabaseAdmin
      .from('estoque')
      .update({
        mesas_entregues: estoque.mesas_entregues + entregarAgora,
      })
      .eq('id', 1);

    if (updateEstoqueErr) throw updateEstoqueErr;

    // ─────────────────────────────────────
    // 6) REGISTRAR LOG
    // ─────────────────────────────────────
    await supabaseAdmin.from('logs').insert({
      usuario_id: user.id,
      acao: 'checkin',
      pacote_id: id_pacote,
      detalhes: {
        entregues_agora: entregarAgora,
        novo_total_entregue: pacote.qtd_mesas_usadas + entregarAgora,
      },
    });

    // ─────────────────────────────────────
    // 7) RETORNO PARA O FRONTEND
    // ─────────────────────────────────────
    const usadas = pacote.qtd_mesas_usadas + entregarAgora;
    const novasRestantes = pacote.qtd_mesas_compradas - usadas;

    return NextResponse.json({
      message: 'Check-in realizado com sucesso',
      usadas,
      restantes: novasRestantes,
    });

  } catch (error) {
    console.error('ERRO NO CHECK-IN:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
