# 🔍 AUDITORIA COMPLETA - PROBLEMAS IDENTIFICADOS

## ❌ PROBLEMA 1: Erro 401 (Credenciais Inválidas)

### Possíveis Causas:
1. **Usuário não existe no banco de dados**
   - Email: `admin@admin.com`
   - Senha: `MinhaSenha123`
   - Verificar se foi criado no Supabase

2. **Coluna `papel` não existe ou está vazia**
   - Código busca `papel` mas pode estar como `role` no banco
   - Verificar estrutura da tabela `usuarios`

3. **Senha não foi hasheada corretamente**
   - Verificar se o hash está correto no banco

---

## ❌ PROBLEMA 2: CSP bloqueando eval()

### Causa:
- Content Security Policy muito restritiva
- Next.js usa `eval()` internamente para hot reload e outras funcionalidades

### Solução:
- Adicionar `'unsafe-eval'` ao `script-src` OU
- Remover CSP temporariamente para testar

---

## ✅ CORREÇÕES NECESSÁRIAS

### 1. Verificar/Criar Usuário Admin no Supabase

Execute este SQL no Supabase SQL Editor:

```sql
-- Verificar se usuário existe
SELECT id, email, nome, papel FROM usuarios WHERE email = 'admin@admin.com';

-- Se não existir, criar (senha: MinhaSenha123)
-- Hash gerado com bcrypt: $2a$10$rK8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X
-- Use o script create-admin.ts para gerar o hash correto
```

### 2. Ajustar CSP no Middleware

Remover ou ajustar CSP para permitir Next.js funcionar.

### 3. Verificar Variáveis de Ambiente na Vercel

Confirmar que todas as 5 variáveis estão configuradas.

---

## 🔧 PRÓXIMOS PASSOS

1. Verificar estrutura da tabela `usuarios` no Supabase
2. Criar usuário admin se não existir
3. Ajustar CSP no middleware
4. Verificar variáveis de ambiente na Vercel
5. Testar login novamente

