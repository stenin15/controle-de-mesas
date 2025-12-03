# ✅ EXECUTAR CHECKLIST COMPLETO

## 🚀 EXECUÇÃO AUTOMÁTICA

Execute o script de verificação completa:

```bash
npx ts-node --transpile-only scripts/verificar-tudo.ts
```

Este script verifica automaticamente:
- ✅ Arquivos essenciais
- ✅ Variáveis de ambiente
- ✅ Conexão com Supabase
- ✅ Tabelas do banco
- ✅ Usuário admin
- ✅ Autenticação
- ✅ Middleware

---

## 📋 CHECKLIST MANUAL

### Configuração Inicial

#### 1. Servidor rodando
```bash
npm run dev
```
✅ Deve aparecer: `Ready in Xs` e `Local: http://localhost:3000`

#### 2. Variáveis de ambiente
Verifique `.env.local` na raiz:
- [ ] `NEXT_PUBLIC_SUPABASE_URL` ✅
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ✅
- [ ] `JWT_SECRET` ✅
- [ ] `NEXT_PUBLIC_BASE_URL` ✅ (opcional)

#### 3. Banco de dados
- [ ] Schema SQL executado no Supabase (`supabase/schema.sql`)
- [ ] Todas as tabelas criadas (usuarios, estoque, pacotes, vendas, logs)

#### 4. Usuário admin
```bash
npx ts-node --transpile-only scripts/create-admin.ts
```
✅ Deve criar usuário: `admin@evento.com` / `admin123`

---

### Teste de Login

#### 5. Preparação
- [ ] Console do navegador aberto (F12 → Console)
- [ ] Terminal do servidor visível
- [ ] Acessou `http://localhost:3000/login`

#### 6. Login
- [ ] Preencheu email: `admin@evento.com`
- [ ] Preencheu senha: `admin123`
- [ ] Clicou em "Entrar"

#### 7. Verificar logs

**No Console (F12):**
- [ ] Aparece "🔵 INICIANDO LOGIN NO FRONTEND"
- [ ] Aparece "🔵 Fazendo fetch para /api/auth/login..."
- [ ] Aparece "🔵 Resposta recebida: 200 OK"
- [ ] Aparece "✅ Login bem-sucedido!"

**No Terminal:**
- [ ] Aparece "🔵 API /api/auth/login CHAMADA"
- [ ] Aparece "🔍 Verificando variáveis de ambiente..."
- [ ] Aparece "✅ Usuário autenticado"
- [ ] Aparece "✅ LOGIN CONCLUÍDO COM SUCESSO"

---

### Resultado Esperado

- [ ] Login bem-sucedido
- [ ] Redirecionamento para `/admin` ou `/funcionario`
- [ ] OU identificou o erro específico nos logs

---

## 🔧 SE ALGO FALHAR

### Erro: "API /api/auth/login CHAMADA" não aparece
1. Verifique `middleware.ts` - deve ter `if (pathname.startsWith("/api"))`
2. Reinicie o servidor
3. Limpe cache (CTRL+SHIFT+R)

### Erro: "Variáveis não configuradas"
1. Verifique `.env.local` na raiz
2. Reinicie o servidor
3. Verifique se não há espaços extras

### Erro: "Credenciais inválidas"
```bash
npx ts-node --transpile-only scripts/create-admin.ts
```

### Erro: Fetch trava
1. Verifique se servidor está rodando
2. Teste: `http://localhost:3000/api/test`
3. Verifique logs do terminal

---

## ✅ TUDO OK?

Se todas as verificações passaram:
- ✅ Sistema está funcionando
- ✅ Login deve funcionar
- ✅ Pronto para uso em eventos reais

**Boa sorte! 🚀**


