/**
 * Script simples para criar admin usando Node.js puro
 * Execute: node scripts/criar-admin-simples.js
 */

const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  console.error('   Verifique se .env.local existe e tem as variáveis corretas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function criarAdmin() {
  const email = 'admin@evento.com';
  const senha = 'admin123';
  const nome = 'Administrador';

  try {
    console.log('🔐 Gerando hash da senha...');
    const senhaHash = await bcrypt.hash(senha, 10);
    console.log('✅ Hash gerado');

    console.log('\n📝 Criando usuário admin...');
    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        nome,
        email,
        senha_hash: senhaHash,
        role: 'admin',
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        console.log('⚠️ Usuário admin já existe!');
        console.log('\n🔄 Atualizando senha do admin existente...');
        
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({ senha_hash: senhaHash })
          .eq('email', email);

        if (updateError) {
          console.error('❌ Erro ao atualizar senha:', updateError.message);
        } else {
          console.log('✅ Senha do admin atualizada com sucesso!');
          console.log('\n📋 Credenciais:');
          console.log('   Email:', email);
          console.log('   Senha:', senha);
        }
      } else {
        console.error('❌ Erro ao criar admin:', error.message);
        console.error('   Código:', error.code);
      }
    } else {
      console.log('✅ Usuário admin criado com sucesso!');
      console.log('\n📋 Credenciais:');
      console.log('   Email:', email);
      console.log('   Senha:', senha);
      console.log('   ID:', data.id);
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

criarAdmin();

