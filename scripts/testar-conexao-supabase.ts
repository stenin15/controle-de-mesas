/**
 * Script para testar conexão com Supabase e verificar usuário admin
 */

import { supabaseAdmin } from '../lib/supabaseAdmin';

async function testarConexao() {
  console.log('🔍 Testando conexão com Supabase...\n');

  try {
    // 1. Testar conexão básica
    console.log('1️⃣ Testando conexão básica...');
    const { data: usuarios, error: errorUsuarios } = await supabaseAdmin
      .from('usuarios')
      .select('id, nome, email, role')
      .limit(5);

    if (errorUsuarios) {
      console.error('❌ ERRO ao conectar com Supabase:');
      console.error('   Mensagem:', errorUsuarios.message);
      console.error('   Código:', errorUsuarios.code);
      console.error('   Detalhes:', errorUsuarios.details);
      return;
    }

    console.log('✅ Conexão com Supabase OK!');
    console.log(`   Total de usuários encontrados: ${usuarios?.length || 0}\n`);

    // 2. Verificar se admin existe
    console.log('2️⃣ Verificando se usuário admin existe...');
    const { data: admin, error: errorAdmin } = await supabaseAdmin
      .from('usuarios')
      .select('id, nome, email, role, criado_em')
      .eq('email', 'admin@evento.com')
      .single();

    if (errorAdmin) {
      if (errorAdmin.code === 'PGRST116') {
        console.log('⚠️ Usuário admin NÃO encontrado!');
        console.log('   Execute: npx ts-node --transpile-only scripts/create-admin.ts\n');
      } else {
        console.error('❌ Erro ao buscar admin:', errorAdmin.message);
      }
    } else if (admin) {
      console.log('✅ Usuário admin encontrado:');
      console.log('   ID:', admin.id);
      console.log('   Nome:', admin.nome);
      console.log('   Email:', admin.email);
      console.log('   Role:', admin.role);
      console.log('   Criado em:', admin.criado_em);
      console.log('\n⚠️ Se o login ainda não funciona, verifique a senha no banco.\n');
    }

    // 3. Listar todos os usuários
    console.log('3️⃣ Listando todos os usuários...');
    if (usuarios && usuarios.length > 0) {
      usuarios.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.nome} (${user.email}) - ${user.role}`);
      });
    } else {
      console.log('   Nenhum usuário encontrado no banco.');
    }

    // 4. Verificar estoque
    console.log('\n4️⃣ Verificando estoque...');
    const { data: estoque, error: errorEstoque } = await supabaseAdmin
      .from('estoque')
      .select('*')
      .eq('id', 1)
      .single();

    if (errorEstoque) {
      console.error('❌ Erro ao buscar estoque:', errorEstoque.message);
    } else if (estoque) {
      console.log('✅ Estoque encontrado:');
      console.log('   Total de mesas:', estoque.total_mesas);
      console.log('   Mesas entregues:', estoque.mesas_entregues);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Teste de conexão concluído!');
    console.log('='.repeat(50));

  } catch (error: any) {
    console.error('\n❌ ERRO CRÍTICO:');
    console.error('   Mensagem:', error.message);
    console.error('   Stack:', error.stack);
    console.error('\n⚠️ Verifique:');
    console.error('   1. NEXT_PUBLIC_SUPABASE_URL está correto no .env.local');
    console.error('   2. SUPABASE_SERVICE_ROLE_KEY está correto no .env.local');
    console.error('   3. O Supabase está acessível');
  }
}

testarConexao();

