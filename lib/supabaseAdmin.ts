import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug: verificar variáveis
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 [supabaseAdmin] Verificando variáveis:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? `✅ ${supabaseUrl.substring(0, 30)}...` : '❌ NÃO DEFINIDO');
  console.log('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? '✅ DEFINIDO' : '❌ NÃO DEFINIDO');
  
  if (supabaseUrl && supabaseUrl.includes('localhost')) {
    console.error('⚠️ ERRO: NEXT_PUBLIC_SUPABASE_URL contém "localhost"!');
    console.error('   Deve ser a URL do Supabase: https://seu-projeto.supabase.co');
  }
}

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas. Verifique NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});


