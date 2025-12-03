import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { generateQRCode } from '@/lib/utils';
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

    // Body da requisição
    const body = await request.json();
    const { nome_cliente, telefone, qtd_mesas_compradas, preco_total } = body;

    if (!nome_cliente || !qtd_mesas_compradas || !preco_total) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    // ────────────────────────────────────────────
    // 1. Criar Pacote
    // ────────────────────────────────────────────
    const { data: pacote, error: pacoteError } = await supabaseAdmin
      .from('pacotes')
      .insert({
        nome_cliente,
        telefone,
        qtd_mesas_compradas,
        preco_total,
        criado_por: user.id,
      })
      .select()
      .single();

    if (pacoteError) throw pacoteError;

    // ────────────────────────────────────────────
    // 2. Registrar Venda Presencial
    // ────────────────────────────────────────────
    await supabaseAdmin.from('vendas').insert({
      pacote_id: pacote.id,
      valor: preco_total,
      mesas: qtd_mesas_compradas,
      vendedor_id: user.id,
      tipo: 'presencial', // Importante
    });

    // ────────────────────────────────────────────
    // 3. Gerar QR Code
    // ────────────────────────────────────────────
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const qrUrl = `${baseUrl}/funcionario/checkin?id=${pacote.id}`;

    const qrCode = await generateQRCode(qrUrl);

    // ────────────────────────────────────────────
    // 4. Log de auditoria
    // ────────────────────────────────────────────
    await supabaseAdmin.from('logs').insert({
      usuario_id: user.id,
      acao: 'venda_presencial',
      pacote_id: pacote.id,
      detalhes: {
        nome_cliente,
        qtd_mesas_compradas,
        preco_total,
      },
    });

    return NextResponse.json({
      message: 'Venda presencial registrada com sucesso',
      pacote,
      qrCode,
    });

  } catch (error) {
    console.error('ERRO VENDA PRESENCIAL:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
