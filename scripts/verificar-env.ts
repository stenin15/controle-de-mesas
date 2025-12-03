/**
 * Script para verificar se as variáveis de ambiente estão sendo lidas
 */

console.log('🔍 Verificando variáveis de ambiente...\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const jwtSecret = process.env.JWT_SECRET;

console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || '❌ NÃO DEFINIDO');
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ DEFINIDO' : '❌ NÃO DEFINIDO');
console.log('JWT_SECRET:', jwtSecret ? '✅ DEFINIDO' : '❌ NÃO DEFINIDO');

if (supabaseUrl) {
  console.log('\n📌 URL do Supabase:', supabaseUrl);
  if (supabaseUrl.includes('localhost')) {
    console.log('⚠️ ATENÇÃO: URL contém "localhost" - isso está ERRADO!');
    console.log('   Deve ser: https://seu-projeto.supabase.co');
  } else if (supabaseUrl.includes('supabase.co')) {
    console.log('✅ URL do Supabase está correta!');
  }
}

