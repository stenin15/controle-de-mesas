import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyToken } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';

// GET — Listar funcionários (apenas admin)
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

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Apenas admin pode listar funcionários' }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('id, nome, email, role, criado_em')
      .order('criado_em', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ funcionarios: data });

  } catch (error) {
    console.error('ERRO AO LISTAR FUNCIONÁRIOS:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// POST — Criar funcionário (apenas admin)
export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: 'Apenas admin pode criar funcionários' }, { status: 403 });
    }

    const { nome, email, senha, role } = await request.json();

    if (!nome || !email || !senha) {
      return NextResponse.json({ error: 'Dados obrigatórios faltando' }, { status: 400 });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // Evita duplicação de email
    const { data: existente } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .single();

    if (existente) {
      return NextResponse.json({ error: 'Já existe um usuário com esse email' }, { status: 400 });
    }

    // Hash da senha
    const senhaHash = await hashPassword(senha);

    // Inserir funcionário
    const { data: funcionario, error: insertError } = await supabaseAdmin
      .from('usuarios')
      .insert({
        nome,
        email,
        senha_hash: senhaHash,
        role: role || 'funcionario'
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // LOG
    await supabaseAdmin.from('logs').insert({
      usuario_id: user.id,
      acao: 'criar_funcionario',
      detalhes: { nome, email, role: role || 'funcionario' },
    });

    return NextResponse.json({
      message: 'Funcionário criado com sucesso',
      funcionario,
    });

  } catch (error) {
    console.error('ERRO AO CRIAR FUNCIONÁRIO:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
