/**
 * DIAGNÓSTICO COMPLETO DO SISTEMA
 * Execute: npx ts-node --transpile-only scripts/diagnostico-completo.ts
 */

import { supabaseAdmin } from '../lib/supabaseAdmin';
import { authenticateUser, hashPassword, verifyPassword } from '../lib/auth';

async function diagnostico() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DO SISTEMA\n');
  console.log('=' .repeat(50));

  // 1. Verificar variáveis de ambiente
  console.log('\n1️⃣ VERIFICANDO VARIÁVEIS DE AMBIENTE...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const jwtSecret = process.env.JWT_SECRET;

  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL não encontrado!');
  } else {
    console.log('✅ NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl.substring(0, 30) + '...');
  }

  if (!supabaseKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrado!');
  } else {
    console.log('✅ SUPABASE_SERVICE_ROLE_KEY:', supabaseKey.substring(0, 30) + '...');
  }

  if (!jwtSecret) {
    console.error('❌ JWT_SECRET não encontrado!');
  } else {
    console.log('✅ JWT_SECRET configurado');
  }

  // 2. Testar conexão com Supabase
  console.log('\n2️⃣ TESTANDO CONEXÃO COM SUPABASE...');
  try {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao conectar:', error.message);
      console.error('   Código:', error.code);
      console.error('   Detalhes:', error.details);
      return;
    }
    console.log('✅ Conexão com Supabase OK!');
  } catch (err: any) {
    console.error('❌ Erro de conexão:', err.message);
    return;
  }

  // 3. Verificar se tabela usuarios existe
  console.log('\n3️⃣ VERIFICANDO TABELA usuarios...');
  try {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao acessar tabela usuarios:', error.message);
      console.error('   Possível causa: Tabela não existe ou RLS bloqueando');
      return;
    }
    console.log('✅ Tabela usuarios acessível');
  } catch (err: any) {
    console.error('❌ Erro:', err.message);
    return;
  }

  // 4. Verificar se usuário admin existe
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
    console.log('💡 SOLUÇÃO: Recriar usuário com hash correto\n');
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
      console.log('   Execute: npx ts-node --transpile-only scripts/create-admin.ts');
      console.log('   Isso vai recriar o usuário com hash correto\n');
    }
    return;
  }

  console.log('✅ Autenticação OK!');
  console.log('   - Usuário:', user.nome);
  console.log('   - Role:', user.role);

  // 6. Verificar outras tabelas
  console.log('\n6️⃣ VERIFICANDO OUTRAS TABELAS...');
  const tabelas = ['estoque', 'pacotes', 'vendas', 'logs'];
  
  for (const tabela of tabelas) {
    try {
      const { error } = await supabaseAdmin
        .from(tabela)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Tabela ${tabela}:`, error.message);
      } else {
        console.log(`✅ Tabela ${tabela}: OK`);
      }
    } catch (err: any) {
      console.error(`❌ Tabela ${tabela}:`, err.message);
    }
  }

  // 7. Verificar estoque inicial
  console.log('\n7️⃣ VERIFICANDO ESTOQUE INICIAL...');
  try {
    const { data: estoque, error } = await supabaseAdmin
      .from('estoque')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !estoque) {
      console.log('⚠️ Estoque não encontrado (pode ser normal se ainda não foi criado)');
    } else {
      console.log('✅ Estoque encontrado:');
      console.log('   - Total mesas:', estoque.total_mesas);
      console.log('   - Entregues:', estoque.mesas_entregues);
    }
  } catch (err: any) {
    console.log('⚠️ Erro ao verificar estoque:', err.message);
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n🎯 RESUMO:');
  console.log('✅ Se todos os testes passaram, o problema pode ser:');
  console.log('   1. Servidor não está rodando na porta correta');
  console.log('   2. Middleware bloqueando requisições');
  console.log('   3. Erro no frontend (verificar console do navegador)');
  console.log('   4. Cache do navegador (tentar CTRL+SHIFT+R)\n');
}

diagnostico().catch(console.error);


