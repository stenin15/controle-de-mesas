/**
 * Script para criar usuário admin inicial
 * Execute: npx ts-node --project tsconfig.scripts.json scripts/create-admin.ts
 * 
 * Ou use a interface web em /admin/funcionarios após criar o primeiro admin manualmente
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Carregar variáveis de ambiente do .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

import { hashPassword } from '../lib/auth';
import { supabaseAdmin } from '../lib/supabaseAdmin';

async function createAdmin() {
  const email = 'admin@admin.com';
  const senha = 'MinhaSenha123';
  const nome = 'Administrador';

  try {
    console.log('🔵 Criando usuário admin...');
    console.log('   Email:', email);
    
    // Hash da senha
    const senhaHash = await hashPassword(senha);
    console.log('   Senha hash gerado');

    const { data, error } = await supabaseAdmin
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
        console.log('   Atualizando senha...');
        
        // Atualizar senha se já existir
        const { error: updateError } = await supabaseAdmin
          .from('usuarios')
          .update({
            senha_hash: senhaHash,
            role: 'admin',
            nome: 'Administrador',
          })
          .eq('email', email);
        
        if (updateError) {
          console.error('❌ Erro ao atualizar:', updateError);
        } else {
          console.log('✅ Senha atualizada com sucesso!');
        }
      } else {
        console.error('❌ Erro ao criar admin:', error);
      }
    } else {
      console.log('✅ Usuário admin criado com sucesso!');
      console.log('   Email:', email);
      console.log('   Senha:', senha);
      console.log('   Role: admin');
    }
  } catch (error: any) {
    console.error('❌ Erro:', error.message);
  }
}

createAdmin();



