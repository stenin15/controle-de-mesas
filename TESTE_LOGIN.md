# 🧪 GUIA DE TESTE E DEBUG DO LOGIN

## 📋 PASSOS PARA TESTAR

### 1. Verificar Console do Navegador (F12)

Ao fazer login, você deve ver:
```
Tentando fazer login... { email: "admin@evento.com" }
Resposta recebida: 200 OK
Dados recebidos: { message: "...", user: { ... } }
```

### 2. Verificar Terminal do Servidor

Você deve ver:
```
🔵 API /api/auth/login chamada
🔵 Body recebido: { email: "admin@evento.com", hasPassword: true }
🔵 Autenticando usuário...
🔵 Usuário autenticado: SIM
🔵 Token gerado
🔵 Cookie definido
✅ Login concluído com sucesso
```

### 3. Verificar Cookie no Navegador

1. F12 → Application → Cookies
2. Deve ter cookie `token` com valor JWT

---

## 🔴 ERROS COMUNS E SOLUÇÕES

### Erro: "API /api/auth/login chamada" não aparece
**Causa:** Middleware interceptando ou fetch não chegando
**Solução:** Verificar middleware.ts - deve ter `if (pathname.startsWith("/api"))`

### Erro: "Credenciais inválidas"
**Causa:** Usuário não existe ou senha errada
**Solução:** 
1. Verificar se usuário existe no Supabase
2. Verificar se senha_hash está correto
3. Recriar usuário se necessário

### Erro: "Erro ao conectar com o servidor"
**Causa:** Problema de rede ou servidor não rodando
**Solução:** 
1. Verificar se servidor está rodando
2. Verificar console do navegador para erro de rede

### Erro: Cookie não é definido
**Causa:** Problema com response.cookies.set()
**Solução:** Já corrigido - usando response.cookies.set()

---

## ✅ VERIFICAÇÃO FINAL

- [ ] Servidor rodando (npm run dev)
- [ ] Console do navegador aberto (F12)
- [ ] Terminal do servidor visível
- [ ] Usuário existe no banco
- [ ] Variáveis de ambiente configuradas
- [ ] Middleware não intercepta /api


