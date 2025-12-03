/**
 * Script para criar usuário admin inicial
 * Execute: npx ts-node scripts/create-admin.ts
 * 
 * Ou use a interface web em /admin/funcionarios após criar o primeiro admin manualmente
 */

import { hashPassword } from '../lib/auth';
import { supabaseAdmin } from '../lib/supabaseAdmin';

async function createAdmin() {
  const email = 'admin@evento.com';
  const senha = 'admin123';
  const nome = 'Administrador';

  try {
    const senhaHash = await hashPassword(senha);

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
        console.log('Usuário admin já existe!');
      } else {
        console.error('Erro ao criar admin:', error);
      }
    } else {
      console.log('Usuário admin criado com sucesso!');
      console.log('Email:', email);
      console.log('Senha:', senha);
      console.log('IMPORTANTE: Altere a senha após o primeiro login!');
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

createAdmin();



