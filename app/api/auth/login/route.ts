import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, generateToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  console.log("=".repeat(50));
  console.log("🔵 API /api/auth/login CHAMADA");
  console.log("=".repeat(50));
  
  try {
    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const jwtSecret = process.env.JWT_SECRET;

    console.log("🔍 Verificando variáveis de ambiente...");
    console.log("   - NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? `✅ ${supabaseUrl}` : "❌ FALTANDO");
    console.log("   - SUPABASE_SERVICE_ROLE_KEY:", supabaseKey ? "✅ OK" : "❌ FALTANDO");
    console.log("   - JWT_SECRET:", jwtSecret ? "✅ OK" : "❌ FALTANDO");
    
    if (supabaseUrl && supabaseUrl.includes('localhost')) {
      console.error("⚠️⚠️⚠️ ERRO CRÍTICO: NEXT_PUBLIC_SUPABASE_URL contém 'localhost'!");
      console.error("   Isso está ERRADO! Deve ser a URL do Supabase: https://seu-projeto.supabase.co");
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error("🔴 ERRO: Variáveis de ambiente do Supabase não configuradas!");
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      );
    }

    console.log("\n🔵 Lendo body da requisição...");
    const body = await request.json();
    console.log("🔵 Body recebido:", { 
      email: body.email, 
      hasPassword: !!body.password,
      passwordLength: body.password?.length || 0
    });
    
    const { email, password } = body;

    if (!email || !password) {
      console.log("🔴 Erro: Email ou senha faltando");
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    console.log("\n🔵 Tentando autenticar usuário...");
    console.log("   - Email:", email);
    
    try {
      const user = await authenticateUser(email, password);
      console.log("🔵 Resultado da autenticação:", user ? "✅ SUCESSO" : "❌ FALHOU");

      if (!user) {
        console.log("🔴 Credenciais inválidas - usuário não encontrado ou senha incorreta");
        
        // Verificar se usuário existe
        const { data: usuarioExiste } = await supabaseAdmin
          .from('usuarios')
          .select('id, email')
          .eq('email', email)
          .single();
        
        if (!usuarioExiste) {
          console.log("   ⚠️ Usuário não existe no banco de dados!");
        } else {
          console.log("   ⚠️ Usuário existe, mas senha está incorreta!");
        }
        
        return NextResponse.json(
          { error: 'Credenciais inválidas' },
          { status: 401 }
        );
      }

      console.log("✅ Usuário autenticado:", {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role
      });

      console.log("\n🔵 Gerando token JWT...");
      const token = generateToken(user);
      console.log("✅ Token gerado (tamanho:", token.length, "caracteres)");

      // grava cookie corretamente (Next.js 15)
      const response = NextResponse.json({
        message: 'Login realizado com sucesso',
        user,
      });

      // Configurar cookie com todas as opções necessárias para Next.js 15
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });

      console.log("✅ Cookie configurado:", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: '7 dias',
        tokenLength: token.length
      });

      // registra log (não crítico se falhar)
      try {
        await supabaseAdmin.from('logs').insert({
          usuario_id: user.id,
          acao: 'login',
          detalhes: { email: user.email },
        });
        console.log("✅ Log registrado no banco");
      } catch (logError: any) {
        console.error("⚠️ Erro ao registrar log (não crítico):", logError.message);
      }

      console.log("\n" + "=".repeat(50));
      console.log("✅ LOGIN CONCLUÍDO COM SUCESSO");
      console.log("=".repeat(50) + "\n");
      
      return response;

    } catch (authError: any) {
      console.error("🔴 ERRO na autenticação:", authError.message);
      console.error("   Stack:", authError.stack);
      return NextResponse.json(
        { error: 'Erro ao autenticar usuário' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("\n" + "=".repeat(50));
    console.error('🔴 ERRO CRÍTICO NO LOGIN:');
    console.error("   Mensagem:", error.message);
    console.error("   Stack:", error.stack);
    console.error("=".repeat(50) + "\n");
    
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
