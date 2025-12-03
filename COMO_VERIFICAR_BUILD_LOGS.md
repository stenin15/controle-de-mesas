# 🔍 COMO VERIFICAR BUILD LOGS NA VERCEL

## 📋 PASSO A PASSO COMPLETO

### 1️⃣ Acessar o Dashboard da Vercel

1. Abra o navegador
2. Acesse: **https://vercel.com/dashboard**
3. Faça login se necessário

---

### 2️⃣ Encontrar Seu Projeto

1. Na lista de projetos, procure por: **`controle-de-mesas`**
2. **Clique no projeto**

---

### 3️⃣ Ver Deployments

1. No menu lateral esquerdo, clique em: **"Deployments"**
2. Você verá uma lista de todos os deployments
3. O mais recente aparece no topo

---

### 4️⃣ Abrir o Último Deployment

1. **Clique no último deployment** (o mais recente)
2. Você verá a página de detalhes do deployment

---

### 5️⃣ Ver Build Logs

Você verá várias seções. Procure por:

#### Opção A: Seção "Build Logs"
- Role a página para baixo
- Procure por uma seção chamada **"Build Logs"**
- **Clique para expandir**

#### Opção B: Aba "Logs"
- No topo da página, há abas: **Deployment**, **Logs**, **Resources**, etc.
- **Clique na aba "Logs"**

---

### 6️⃣ Analisar os Logs

Procure por estas palavras-chave:

#### ✅ SUCESSO (Build OK):
```
✓ Build Completed
✓ Compiled successfully
✓ Route (app) /login
```

#### ❌ ERRO (Build Falhou):
```
✗ Error
✗ Failed to compile
✗ Route /login not found
✗ Cannot find module
✗ Type error
```

---

## 📸 O QUE PROCURAR NOS LOGS

### Erros Comuns:

1. **"Route /login not found"**
   - Problema: Arquivo não foi encontrado
   - Solução: Verificar se `app/login/page.tsx` existe

2. **"Cannot find module '@/lib/auth'"**
   - Problema: Import quebrado
   - Solução: Verificar imports

3. **"Type error"**
   - Problema: Erro de TypeScript
   - Solução: Verificar tipos

4. **"Environment variable not found"**
   - Problema: Variável de ambiente faltando
   - Solução: Adicionar na Vercel

5. **"Build failed"**
   - Problema: Erro geral no build
   - Solução: Ver mensagem específica

---

## 📋 CHECKLIST DE VERIFICAÇÃO

### Na Vercel Dashboard:

- [ ] Acessei o projeto `controle-de-mesas`
- [ ] Abri a aba "Deployments"
- [ ] Cliquei no último deployment
- [ ] Abri a seção "Build Logs" ou aba "Logs"
- [ ] Li os logs completos
- [ ] Identifiquei erros (se houver)

---

## 🎯 O QUE FAZER DEPOIS

### Se o Build FALHOU:

1. **Copie os erros** que aparecem nos logs
2. **Me envie** os erros
3. **Vou corrigir** o código

### Se o Build PASSOU mas ainda dá 404:

1. **Verifique as variáveis de ambiente:**
   - Vercel → Settings → Environment Variables
   - Confirme que todas as 5 variáveis estão lá

2. **Verifique os Runtime Logs:**
   - Vercel → Deployments → Clique no deployment
   - Aba "Functions" → Veja os logs de runtime

---

## 📝 EXEMPLO DE LOGS

### ✅ Build Bem-Sucedido:
```
09:26:20.085 Running "vercel build"
09:26:20.462 Vercel CLI 48.12.0
09:26:20.643 Build Completed in /vercel/output [17ms]
09:26:20.734 Deploying outputs...
09:26:23.680 Deployment completed
```

### ❌ Build com Erro:
```
09:26:20.085 Running "vercel build"
09:26:20.462 Vercel CLI 48.12.0
✗ Error: Route /login not found
✗ Build failed
```

---

## 🚀 PRÓXIMOS PASSOS

1. **Siga os passos acima**
2. **Copie os logs** (especialmente os erros)
3. **Me envie** os logs
4. **Vou corrigir** o problema

---

**Siga esses passos e me envie o que encontrar nos logs!** 🔍

