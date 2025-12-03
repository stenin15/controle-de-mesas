/**
 * Script para verificar e configurar o banco de dados
 * Execute: npx ts-node scripts/verificar-banco.ts
 */

import { supabaseAdmin } from '../lib/supabaseAdmin';
import { hashPassword } from '../lib/auth';

async function verificarBanco() {
  console.log('🔍 Verificando banco de dados...\n');

  try {
    // 1. Verificar tabelas
    console.log('1️⃣ Verificando tabelas...');
    const tabelas = ['usuarios', 'estoque', 'pacotes', 'vendas', 'logs'];
    
    for (const tabela of tabelas) {
      const { data, error } = await supabaseAdmin
        .from(tabela)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`   ❌ Tabela ${tabela}: ERRO - ${error.message}`);
      } else {
        console.log(`   ✅ Tabela ${tabela}: OK`);
      }
    }

    // 2. Verificar estoque inicial
    console.log('\n2️⃣ Verificando estoque inicial...');
    const { data: estoque, error: estoqueError } = await supabaseAdmin
      .from('estoque')
      .select('*')
      .eq('id', 1)
      .single();

    if (estoqueError || !estoque) {
      console.log('   ⚠️ Estoque não encontrado. Criando estoque inicial...');
      const { error: insertError } = await supabaseAdmin
        .from('estoque')
        .insert({ id: 1, total_mesas: 100, mesas_entregues: 0 });
      
      if (insertError) {
        console.error('   ❌ Erro ao criar estoque:', insertError.message);
      } else {
        console.log('   ✅ Estoque criado com sucesso!');
      }
    } else {
      console.log(`   ✅ Estoque OK: ${estoque.total_mesas} mesas totais, ${estoque.mesas_entregues} entregues`);
    }

    // 3. Verificar usuário admin
    console.log('\n3️⃣ Verificando usuário admin...');
    const { data: admin, error: adminError } = await supabaseAdmin
      .from('usuarios')
      .select('id, nome, email, role')
      .eq('email', 'admin@evento.com')
      .single();

    if (adminError || !admin) {
      console.log('   ⚠️ Admin não encontrado. Criando usuário admin...');
      
      const senhaHash = await hashPassword('admin123');
      const { data: novoAdmin, error: createError } = await supabaseAdmin
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
          console.log('   ℹ️ Admin já existe (conflito de email)');
        } else {
          console.error('   ❌ Erro ao criar admin:', createError.message);
        }
      } else {
        console.log('   ✅ Admin criado com sucesso!');
        console.log('      Email: admin@evento.com');
        console.log('      Senha: admin123');
        console.log('      ⚠️ IMPORTANTE: Altere a senha após o primeiro login!');
      }
    } else {
      console.log('   ✅ Admin encontrado:');
      console.log(`      Nome: ${admin.nome}`);
      console.log(`      Email: ${admin.email}`);
      console.log(`      Role: ${admin.role}`);
    }

    // 4. Contar usuários
    console.log('\n4️⃣ Contando usuários...');
    const { count, error: countError } = await supabaseAdmin
      .from('usuarios')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('   ❌ Erro ao contar usuários:', countError.message);
    } else {
      console.log(`   ✅ Total de usuários: ${count || 0}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Verificação do banco concluída!');
    console.log('='.repeat(50));

  } catch (error: any) {
    console.error('\n❌ ERRO CRÍTICO:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

verificarBanco();

