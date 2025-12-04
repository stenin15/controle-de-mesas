#!/usr/bin/env node

/**
 * Script para atualizar o GitHub automaticamente
 * Uso: node scripts/atualizar-github.js [mensagem do commit]
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function runCommand(command, description) {
  try {
    console.log(`\n🔄 ${description}...`);
    const output = execSync(command, { encoding: 'utf-8', stdio: 'inherit' });
    console.log(`✅ ${description} concluído!\n`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao executar: ${description}`);
    console.error(error.message);
    return false;
  }
}

async function getCommitMessage(defaultMessage) {
  return new Promise((resolve) => {
    rl.question(`Mensagem do commit [${defaultMessage}]: `, (answer) => {
      resolve(answer.trim() || defaultMessage);
      rl.close();
    });
  });
}

async function main() {
  console.log('='.repeat(60));
  console.log('🚀 ATUALIZADOR AUTOMÁTICO DO GITHUB');
  console.log('='.repeat(60));

  // Verificar se há mudanças
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    if (!status.trim()) {
      console.log('✅ Nenhuma mudança para commitar!');
      return;
    }
  } catch (error) {
    console.error('❌ Erro ao verificar status do git');
    return;
  }

  // Mostrar mudanças
  console.log('\n📋 Mudanças detectadas:');
  try {
    execSync('git status --short', { stdio: 'inherit' });
  } catch (error) {
    console.error('Erro ao mostrar mudanças');
  }

  // Obter mensagem do commit
  const timestamp = new Date().toLocaleString('pt-BR');
  const defaultMessage = `Update: ${timestamp}`;
  const commitMessage = process.argv[2] || await getCommitMessage(defaultMessage);

  // Adicionar todas as mudanças
  if (!runCommand('git add -A', 'Adicionando todas as mudanças')) {
    return;
  }

  // Fazer commit
  if (!runCommand(`git commit -m "${commitMessage}"`, 'Fazendo commit')) {
    return;
  }

  // Fazer push
  if (!runCommand('git push origin main', 'Enviando para o GitHub')) {
    return;
  }

  console.log('='.repeat(60));
  console.log('✅ REPOSITÓRIO ATUALIZADO COM SUCESSO!');
  console.log('='.repeat(60));
  console.log(`📝 Commit: ${commitMessage}`);
  console.log('🌐 GitHub: https://github.com/stenin15/controle-de-mesas');
}

main().catch(console.error);

