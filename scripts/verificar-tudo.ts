/**
 * VERIFICAÇÃO COMPLETA DO SISTEMA
 * Execute: npx ts-node --transpile-only scripts/verificar-tudo.ts
 */

import { supabaseAdmin } from '../lib/supabaseAdmin';
import { authenticateUser } from '../lib/auth';
import * as fs from 'fs';
import * as path from 'path';

interface Verificacao {
  nome: string;
  status: 'ok' | 'erro' | 'aviso';
  mensagem: string;
}

const verificacoes: Verificacao[] = [];

function adicionarVerificacao(nome: string, status: 'ok' | 'erro' | 'aviso', mensagem: string) {
  verificacoes.push({ nome, status, mensagem });
}

async function verificarTudo() {
  console.log('🔍 VERIFICAÇÃO COMPLETA DO SISTEMA\n');
  console.log('='.repeat(60));

  // 1. Verificar arquivos essenciais
  console.log('\n1️⃣ VERIFICANDO ARQUIVOS ESSENCIAIS...');
  
  const arquivos = [
    'app/api/auth/login/route.ts',
    'app/login/page.tsx',
    'middleware.ts',
    'lib/auth.ts',
    'lib/supabaseAdmin.ts',
    'package.json',
    'next.config.js',
  ];

  for (const arquivo of arquivos) {
    const existe = fs.existsSync(path.join(process.cwd(), arquivo));
    if (existe) {
      adicionarVerificacao(`Arquivo ${arquivo}`, 'ok', 'Arquivo existe');
      console.log(`✅ ${arquivo}`);
    } else {
      adicionarVerificacao(`Arquivo ${arquivo}`, 'erro', 'Arquivo não encontrado');
      console.log(`❌ ${arquivo} - NÃO ENCONTRADO`);
    }
  }

  // 2. Verificar variáveis de ambiente
  console.log('\n2️⃣ VERIFICANDO VARIÁVEIS DE AMBIENTE...');
  
  const envPath = path.join(process.cwd(), '.env.local');
  const envExiste = fs.existsSync(envPath);
  
  if (envExiste) {
    adicionarVerificacao('.env.local', 'ok', 'Arquivo existe');
    console.log('✅ .env.local existe');
    
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const variaveis = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'JWT_SECRET',
    ];
    
    for (const varName of variaveis) {
      if (envContent.includes(varName)) {
        adicionarVerificacao(`Variável ${varName}`, 'ok', 'Configurada');
        console.log(`✅ ${varName} configurada`);
      } else {
        adicionarVerificacao(`Variável ${varName}`, 'erro', 'Não configurada');
        console.log(`❌ ${varName} - NÃO CONFIGURADA`);
      }
    }
  } else {
    adicionarVerificacao('.env.local', 'erro', 'Arquivo não encontrado');
    console.log('❌ .env.local - NÃO ENCONTRADO');
  }

  // 3. Verificar conexão com Supabase
  console.log('\n3️⃣ VERIFICANDO CONEXÃO COM SUPABASE...');
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      adicionarVerificacao('Conexão Supabase', 'erro', 'Variáveis não configuradas');
      console.log('❌ Variáveis de ambiente não configuradas');
    } else {
      const { error } = await supabaseAdmin
        .from('usuarios')
        .select('count')
        .limit(1);

      if (error) {
        adicionarVerificacao('Conexão Supabase', 'erro', `Erro: ${error.message}`);
        console.log(`❌ Erro ao conectar: ${error.message}`);
      } else {
        adicionarVerificacao('Conexão Supabase', 'ok', 'Conexão OK');
        console.log('✅ Conexão com Supabase OK');
      }
    }
  } catch (err: any) {
    adicionarVerificacao('Conexão Supabase', 'erro', `Erro: ${err.message}`);
    console.log(`❌ Erro: ${err.message}`);
  }

  // 4. Verificar tabelas
  console.log('\n4️⃣ VERIFICANDO TABELAS...');
  
  const tabelas = ['usuarios', 'estoque', 'pacotes', 'vendas', 'logs'];
  
  for (const tabela of tabelas) {
    try {
      const { error } = await supabaseAdmin
        .from(tabela)
        .select('*')
        .limit(1);
      
      if (error) {
        adicionarVerificacao(`Tabela ${tabela}`, 'erro', `Erro: ${error.message}`);
        console.log(`❌ ${tabela}: ${error.message}`);
      } else {
        adicionarVerificacao(`Tabela ${tabela}`, 'ok', 'Tabela existe');
        console.log(`✅ ${tabela}`);
      }
    } catch (err: any) {
      adicionarVerificacao(`Tabela ${tabela}`, 'erro', `Erro: ${err.message}`);
      console.log(`❌ ${tabela}: ${err.message}`);
    }
  }

  // 5. Verificar usuário admin
  console.log('\n5️⃣ VERIFICANDO USUÁRIO ADMIN...');
  
  try {
    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('email', 'admin@evento.com')
      .single();

    if (error || !usuario) {
      adicionarVerificacao('Usuário admin', 'erro', 'Usuário não encontrado');
      console.log('❌ Usuário admin não encontrado');
      console.log('💡 Execute: npx ts-node --transpile-only scripts/create-admin.ts');
    } else {
      adicionarVerificacao('Usuário admin', 'ok', 'Usuário existe');
      console.log('✅ Usuário admin encontrado');
      console.log(`   - Nome: ${usuario.nome}`);
      console.log(`   - Email: ${usuario.email}`);
      console.log(`   - Role: ${usuario.role}`);
      
      if (!usuario.senha_hash) {
        adicionarVerificacao('Hash da senha', 'erro', 'Hash não configurado');
        console.log('❌ Hash da senha não configurado');
      } else {
        adicionarVerificacao('Hash da senha', 'ok', 'Hash configurado');
        console.log('✅ Hash da senha configurado');
      }
    }
  } catch (err: any) {
    adicionarVerificacao('Usuário admin', 'erro', `Erro: ${err.message}`);
    console.log(`❌ Erro: ${err.message}`);
  }

  // 6. Testar autenticação
  console.log('\n6️⃣ TESTANDO AUTENTICAÇÃO...');
  
  try {
    const user = await authenticateUser('admin@evento.com', 'admin123');
    
    if (!user) {
      adicionarVerificacao('Autenticação', 'erro', 'Autenticação falhou');
      console.log('❌ Autenticação falhou');
    } else {
      adicionarVerificacao('Autenticação', 'ok', 'Autenticação OK');
      console.log('✅ Autenticação OK');
      console.log(`   - Usuário: ${user.nome}`);
      console.log(`   - Role: ${user.role}`);
    }
  } catch (err: any) {
    adicionarVerificacao('Autenticação', 'erro', `Erro: ${err.message}`);
    console.log(`❌ Erro: ${err.message}`);
  }

  // 7. Verificar middleware
  console.log('\n7️⃣ VERIFICANDO MIDDLEWARE...');
  
  try {
    const middlewarePath = path.join(process.cwd(), 'middleware.ts');
    const middlewareContent = fs.readFileSync(middlewarePath, 'utf-8');
    
    if (middlewareContent.includes('pathname.startsWith("/api")')) {
      adicionarVerificacao('Middleware - APIs', 'ok', 'APIs estão liberadas');
      console.log('✅ Middleware libera rotas /api');
    } else {
      adicionarVerificacao('Middleware - APIs', 'erro', 'APIs podem estar bloqueadas');
      console.log('❌ Middleware pode estar bloqueando APIs');
    }
    
    if (middlewareContent.includes('/login')) {
      adicionarVerificacao('Middleware - Login', 'ok', 'Rota /login liberada');
      console.log('✅ Middleware libera rota /login');
    } else {
      adicionarVerificacao('Middleware - Login', 'aviso', 'Verificar rota /login');
      console.log('⚠️ Verificar se rota /login está liberada');
    }
  } catch (err: any) {
    adicionarVerificacao('Middleware', 'erro', `Erro: ${err.message}`);
    console.log(`❌ Erro: ${err.message}`);
  }

  // Resumo final
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 RESUMO DAS VERIFICAÇÕES\n');
  
  const ok = verificacoes.filter(v => v.status === 'ok').length;
  const erro = verificacoes.filter(v => v.status === 'erro').length;
  const aviso = verificacoes.filter(v => v.status === 'aviso').length;
  
  console.log(`✅ OK: ${ok}`);
  console.log(`❌ ERROS: ${erro}`);
  console.log(`⚠️ AVISOS: ${aviso}`);
  console.log(`📋 TOTAL: ${verificacoes.length}\n`);

  if (erro === 0) {
    console.log('🎉 TODAS AS VERIFICAÇÕES PASSARAM!');
    console.log('✅ Sistema pronto para uso!\n');
  } else {
    console.log('⚠️ ALGUMAS VERIFICAÇÕES FALHARAM');
    console.log('📝 Verifique os erros acima e corrija antes de usar o sistema\n');
  }

  // Listar erros
  if (erro > 0) {
    console.log('🔴 ERROS ENCONTRADOS:\n');
    verificacoes
      .filter(v => v.status === 'erro')
      .forEach(v => {
        console.log(`❌ ${v.nome}: ${v.mensagem}`);
      });
    console.log('');
  }
}

verificarTudo().catch(console.error);


