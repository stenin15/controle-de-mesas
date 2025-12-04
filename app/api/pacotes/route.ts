import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { generateQRCode } from '@/lib/utils';
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

    const body = await request.json();
    const { nome_cliente, telefone, qtd_mesas_compradas, preco_total } = body;

    if (!nome_cliente || !qtd_mesas_compradas || !preco_total) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    // 1. Criar pacote
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

    // 2. Criar venda
    await supabaseAdmin.from('vendas').insert({
      pacote_id: pacote.id,
      valor: preco_total,
      mesas: qtd_mesas_compradas,
      vendedor_id: user.id,
      tipo: 'venda',
    });

    // 3. Gerar QR Code com a URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const qrUrl = `${baseUrl}/funcionario/checkin?id=${pacote.id}`;
    const qrCode = await generateQRCode(qrUrl);

    // 4. Log
    await supabaseAdmin.from('logs').insert({
      usuario_id: user.id,
      acao: 'criar_pacote',
      pacote_id: pacote.id,
      detalhes: { nome_cliente, qtd_mesas_compradas, preco_total },
    });

    return NextResponse.json({ pacote, qrCode });

  } catch (error) {
    console.error('ERRO AO CRIAR PACOTE:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 });
    }

    const isAdmin = user.role === 'admin';

    let query = supabaseAdmin
      .from('pacotes')
      .select('*')
      .order('data_compra', { ascending: false });

    if (!isAdmin) {
      query = query.eq('criado_por', user.id);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ pacotes: data });

  } catch (error) {
    console.error('ERRO AO LISTAR PACOTES:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
