/**
 * Script para testar login e verificar problemas
 * Execute: npx ts-node scripts/test-login.ts
 */

import { supabaseAdmin } from '../lib/supabaseAdmin';
import { authenticateUser, verifyPassword } from '../lib/auth';

async function testLogin() {
  console.log('🧪 TESTE DE LOGIN\n');

  // 1. Verificar conexão com Supabase
  console.log('1️⃣ Verificando conexão com Supabase...');
  try {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro ao conectar com Supabase:', error.message);
      return;
    }
    console.log('✅ Conexão com Supabase OK\n');
  } catch (err: any) {
    console.error('❌ Erro de conexão:', err.message);
    return;
  }

  // 2. Verificar se usuário admin existe
  console.log('2️⃣ Verificando se usuário admin existe...');
  const { data: usuario, error: userError } = await supabaseAdmin
    .from('usuarios')
    .select('*')
    .eq('email', 'admin@evento.com')
    .single();

  if (userError || !usuario) {
    console.error('❌ Usuário admin não encontrado!');
    console.log('💡 Execute: npx ts-node scripts/create-admin.ts\n');
    return;
  }

  console.log('✅ Usuário encontrado:');
  console.log('   - ID:', usuario.id);
  console.log('   - Nome:', usuario.nome);
  console.log('   - Email:', usuario.email);
  console.log('   - Role:', usuario.role);
  console.log('   - Hash:', usuario.senha_hash?.substring(0, 20) + '...\n');

  // 3. Testar autenticação
  console.log('3️⃣ Testando autenticação...');
  const user = await authenticateUser('admin@evento.com', 'admin123');
  
  if (!user) {
    console.error('❌ Autenticação falhou!');
    console.log('💡 Possíveis causas:');
    console.log('   - Senha_hash incorreto no banco');
    console.log('   - Senha digitada está errada');
    console.log('   - Problema com bcrypt\n');
    
    // Testar senha manualmente
    console.log('🔍 Testando senha manualmente...');
    const testPassword = await verifyPassword('admin123', usuario.senha_hash);
    console.log('   - Senha "admin123" válida?', testPassword ? 'SIM ✅' : 'NÃO ❌');
    return;
  }

  console.log('✅ Autenticação OK!');
  console.log('   - Usuário autenticado:', user.nome);
  console.log('   - Role:', user.role);
  console.log('\n🎉 TUDO FUNCIONANDO! O login deve funcionar no navegador.\n');
}

testLogin();


