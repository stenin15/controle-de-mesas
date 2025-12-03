/**
 * TESTE COMPLETO DO SUPABASE
 * Execute: npx ts-node --transpile-only scripts/test-supabase.ts
 */

import { supabaseAdmin } from '../lib/supabaseAdmin';
import { authenticateUser, hashPassword, verifyPassword } from '../lib/auth';

async function testSupabase() {
  console.log('🔍 TESTE COMPLETO DO SUPABASE\n');
  console.log('='.repeat(60));

  // 1. Verificar variáveis de ambiente
  console.log('\n1️⃣ VERIFICANDO VARIÁVEIS DE AMBIENTE...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const jwtSecret = process.env.JWT_SECRET;

  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL não encontrado!');
    console.log('   Verifique o arquivo .env.local na raiz do projeto');
    return;
  }
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl.substring(0, 40) + '...');

  if (!supabaseKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrado!');
    console.log('   Verifique o arquivo .env.local na raiz do projeto');
    return;
  }
  console.log('✅ SUPABASE_SERVICE_ROLE_KEY:', supabaseKey.substring(0, 40) + '...');

  if (!jwtSecret) {
    console.error('❌ JWT_SECRET não encontrado!');
    console.log('   Verifique o arquivo .env.local na raiz do projeto');
    return;
  }
  console.log('✅ JWT_SECRET configurado');

  // 2. Testar conexão com Supabase
  console.log('\n2️⃣ TESTANDO CONEXÃO COM SUPABASE...');
  try {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao conectar com Supabase:');
      console.error('   Código:', error.code);
      console.error('   Mensagem:', error.message);
      console.error('   Detalhes:', error.details);
      console.error('   Hint:', error.hint);
      return;
    }
    console.log('✅ Conexão com Supabase OK!');
  } catch (err: any) {
    console.error('❌ Erro de conexão:', err.message);
    console.error('   Stack:', err.stack);
    return;
  }

  // 3. Verificar tabelas
  console.log('\n3️⃣ VERIFICANDO TABELAS...');
  const tabelas = ['usuarios', 'estoque', 'pacotes', 'vendas', 'logs'];
  
  for (const tabela of tabelas) {
    try {
      const { error } = await supabaseAdmin
        .from(tabela)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Tabela ${tabela}:`, error.message);
        if (error.code === '42P01') {
          console.error('   ⚠️ Tabela não existe! Execute o schema.sql no Supabase');
        }
      } else {
        console.log(`✅ Tabela ${tabela}: OK`);
      }
    } catch (err: any) {
      console.error(`❌ Tabela ${tabela}:`, err.message);
    }
  }

  // 4. Verificar usuário admin
  console.log('\n4️⃣ VERIFICANDO USUÁRIO ADMIN...');
  const { data: usuario, error: userError } = await supabaseAdmin
    .from('usuarios')
    .select('*')
    .eq('email', 'admin@evento.com')
    .single();

  if (userError || !usuario) {
    console.error('❌ Usuário admin não encontrado!');
    console.log('\n💡 SOLUÇÃO: Criar usuário admin');
    console.log('   Execute: npx ts-node --transpile-only scripts/create-admin.ts\n');
    
    // Tentar criar automaticamente
    console.log('🔄 Tentando criar usuário admin automaticamente...');
    try {
      const senhaHash = await hashPassword('admin123');
      const { data: novoUsuario, error: createError } = await supabaseAdmin
        .from('usuarios')
        .insert({
          nome: 'Administrador',
          email: 'admin@evento.com',
          senha_hash: senhaHash,
          role: 'admin',
        })
        .select()
        .single();

      if (createError) {
        if (createError.code === '23505') {
          console.log('⚠️ Usuário já existe (mas não foi encontrado na busca)');
        } else {
          console.error('❌ Erro ao criar:', createError.message);
        }
      } else {
        console.log('✅ Usuário admin criado com sucesso!');
        console.log('   Email: admin@evento.com');
        console.log('   Senha: admin123');
      }
    } catch (err: any) {
      console.error('❌ Erro ao criar usuário:', err.message);
    }
    return;
  }

  console.log('✅ Usuário encontrado:');
  console.log('   - ID:', usuario.id);
  console.log('   - Nome:', usuario.nome);
  console.log('   - Email:', usuario.email);
  console.log('   - Role:', usuario.role);
  console.log('   - Hash existe?', usuario.senha_hash ? 'SIM ✅' : 'NÃO ❌');

  if (!usuario.senha_hash) {
    console.error('\n❌ PROBLEMA: senha_hash está vazio!');
    console.log('💡 SOLUÇÃO: Atualizar hash da senha');
    try {
      const senhaHash = await hashPassword('admin123');
      const { error: updateError } = await supabaseAdmin
        .from('usuarios')
        .update({ senha_hash: senhaHash })
        .eq('id', usuario.id);

      if (updateError) {
        console.error('❌ Erro ao atualizar:', updateError.message);
      } else {
        console.log('✅ Hash da senha atualizado!');
      }
    } catch (err: any) {
      console.error('❌ Erro:', err.message);
    }
    return;
  }

  // 5. Testar autenticação
  console.log('\n5️⃣ TESTANDO AUTENTICAÇÃO...');
  const user = await authenticateUser('admin@evento.com', 'admin123');

  if (!user) {
    console.error('❌ Autenticação FALHOU!');
    console.log('\n🔍 Testando senha manualmente...');
    const testPassword = await verifyPassword('admin123', usuario.senha_hash);
    console.log('   - Senha "admin123" válida?', testPassword ? 'SIM ✅' : 'NÃO ❌');

    if (!testPassword) {
      console.log('\n💡 SOLUÇÃO: Hash da senha está incorreto');
      console.log('   Atualizando hash...');
      try {
        const senhaHash = await hashPassword('admin123');
        const { error: updateError } = await supabaseAdmin
          .from('usuarios')
          .update({ senha_hash: senhaHash })
          .eq('id', usuario.id);

        if (updateError) {
          console.error('❌ Erro ao atualizar:', updateError.message);
        } else {
          console.log('✅ Hash atualizado! Testando novamente...');
          const user2 = await authenticateUser('admin@evento.com', 'admin123');
          if (user2) {
            console.log('✅ Autenticação funcionando agora!');
          } else {
            console.error('❌ Ainda não funciona após atualizar');
          }
        }
      } catch (err: any) {
        console.error('❌ Erro:', err.message);
      }
    }
    return;
  }

  console.log('✅ Autenticação OK!');
  console.log('   - Usuário:', user.nome);
  console.log('   - Role:', user.role);
  console.log('   - Email:', user.email);

  // 6. Verificar estoque
  console.log('\n6️⃣ VERIFICANDO ESTOQUE...');
  try {
    const { data: estoque, error } = await supabaseAdmin
      .from('estoque')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️ Estoque não existe - criando...');
        const { error: createError } = await supabaseAdmin
          .from('estoque')
          .insert({
            id: 1,
            total_mesas: 100,
            mesas_entregues: 0,
          });

        if (createError) {
          console.error('❌ Erro ao criar estoque:', createError.message);
        } else {
          console.log('✅ Estoque criado!');
        }
      } else {
        console.error('❌ Erro:', error.message);
      }
    } else {
      console.log('✅ Estoque encontrado:');
      console.log('   - Total mesas:', estoque.total_mesas);
      console.log('   - Entregues:', estoque.mesas_entregues);
    }
  } catch (err: any) {
    console.error('❌ Erro:', err.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n🎯 RESUMO FINAL:');
  console.log('✅ Se todos os testes passaram, o Supabase está OK!');
  console.log('✅ O problema pode estar no servidor Next.js ou no middleware');
  console.log('\n💡 PRÓXIMOS PASSOS:');
  console.log('   1. Verifique se o servidor está rodando (npm run dev)');
  console.log('   2. Verifique os logs do terminal quando tentar fazer login');
  console.log('   3. Se aparecer "API /api/auth/login CHAMADA" no terminal,');
  console.log('      o problema está na autenticação ou resposta');
  console.log('   4. Se NÃO aparecer, o problema está no middleware ou rota\n');
}

testSupabase().catch(console.error);


