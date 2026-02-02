#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Configurando CRM Fermaquinas...\n');

// Verificar se o Node.js está na versão correta
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js 18+ é necessário. Versão atual:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js versão:', nodeVersion);

// Verificar se o .env existe
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('📄 Arquivo .env criado a partir do .env.example');
    console.log('⚠️  Configure suas variáveis de ambiente no arquivo .env');
  } else {
    console.log('⚠️  Arquivo .env.example não encontrado');
  }
} else {
  console.log('✅ Arquivo .env já existe');
}

// Instalar dependências
console.log('\n📦 Instalando dependências...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependências instaladas com sucesso');
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error.message);
  process.exit(1);
}

// Verificar se o Supabase está configurado
console.log('\n🔍 Verificando configuração...');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const hasSupabaseUrl = envContent.includes('NUXT_SUPABASE_URL=') && 
                        !envContent.includes('NUXT_SUPABASE_URL=https://your-project.supabase.co');
  const hasSupabaseKey = envContent.includes('NUXT_SUPABASE_KEY=') && 
                        !envContent.includes('NUXT_SUPABASE_KEY=your-anon-key');
  
  if (hasSupabaseUrl && hasSupabaseKey) {
    console.log('✅ Configuração do Supabase encontrada');
  } else {
    console.log('⚠️  Configure as variáveis do Supabase no arquivo .env');
    console.log('   - NUXT_SUPABASE_URL');
    console.log('   - NUXT_SUPABASE_KEY');
  }
}

console.log('\n🎉 Setup concluído!');
console.log('\n📋 Próximos passos:');
console.log('1. Configure as variáveis de ambiente no arquivo .env');
console.log('2. Execute o script SQL no seu projeto Supabase');
console.log('3. Execute "npm run dev" para iniciar o desenvolvimento');
console.log('\n📚 Documentação: README.md');
console.log('🚀 Deploy: DEPLOYMENT.md');
console.log('🤝 Contribuição: CONTRIBUTING.md');