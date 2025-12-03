# 🔍 GUIA DE DEBUG - LOGIN NÃO FUNCIONA

## 📋 CHECKLIST RÁPIDO

### 1. Verificar se servidor está rodando
- Terminal deve mostrar: `Ready in Xs`
- URL deve ser: `http://localhost:3000` (ou porta que aparecer)

### 2. Verificar Console do Navegador (F12)
Ao clicar em "Entrar", você DEVE ver:
```
==================================================
🔵 INICIANDO LOGIN NO FRONTEND
==================================================
Email: admin@evento.com
Senha preenchida? true

🔵 Fazendo fetch para /api/auth/login...
```

### 3. Verificar Terminal do Servidor
Você DEVE ver:
```
==================================================
🔵 API /api/auth/login CHAMADA
==================================================
🔍 Verificando variáveis de ambiente...
   - NEXT_PUBLIC_SUPABASE_URL: ✅ OK
   - SUPABASE_SERVICE_ROLE_KEY: ✅ OK
   - JWT_SECRET: ✅ OK
```

---

## 🔴 PROBLEMAS COMUNS

### Problema 1: Console vazio (nada aparece)
**Causa:** JavaScript não está executando ou erro antes do fetch

**Solução:**
1. Verifique se há erros no console (vermelho)
2. Recarregue a página (CTRL+SHIFT+R)
3. Verifique se o arquivo `app/login/page.tsx` está salvo

### Problema 2: "API /api/auth/login CHAMADA" não aparece
**Causa:** Middleware bloqueando ou fetch não chegando

**Solução:**
1. Verifique `middleware.ts` - deve ter `if (pathname.startsWith("/api"))`
2. Verifique se servidor está na porta correta
3. Verifique se não há erro de CORS

### Problema 3: "Variáveis de ambiente não configuradas"
**Causa:** `.env.local` não está sendo lido

**Solução:**
1. Verifique se `.env.local` existe na raiz
2. Reinicie o servidor (CTRL+C e `npm run dev`)
3. Verifique se variáveis estão sem espaços extras

### Problema 4: "Credenciais inválidas"
**Causa:** Usuário não existe ou senha errada

**Solução:**
1. Execute: `npx ts-node --transpile-only scripts/create-admin.ts`
2. Verifique se usuário foi criado no Supabase
3. Tente login novamente

### Problema 5: "Erro ao conectar com o servidor"
**Causa:** Supabase não está acessível ou chaves erradas

**Solução:**
1. Verifique URL do Supabase no `.env.local`
2. Verifique SERVICE_ROLE_KEY no `.env.local`
3. Teste conexão no Supabase Dashboard

---

## 🧪 TESTE PASSO A PASSO

1. **Abra o console do navegador (F12)**
2. **Abra o terminal do servidor**
3. **Preencha email e senha**
4. **Clique em "Entrar"**
5. **Observe os logs:**

   **No Console (Navegador):**
   - Deve aparecer logs começando com 🔵
   - Deve mostrar status da resposta
   - Deve mostrar dados recebidos

   **No Terminal (Servidor):**
   - Deve aparecer "API /api/auth/login CHAMADA"
   - Deve mostrar verificação de variáveis
   - Deve mostrar resultado da autenticação

6. **Se algo não aparecer, me envie:**
   - Screenshot do console do navegador
   - Screenshot do terminal do servidor
   - Qualquer erro em vermelho

---

## ✅ SE TUDO ESTIVER OK

Você verá:
- Console: "✅ Login bem-sucedido!"
- Terminal: "✅ LOGIN CONCLUÍDO COM SUCESSO"
- Redirecionamento para `/admin` ou `/funcionario`


