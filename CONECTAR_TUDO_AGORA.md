# 🔗 CONECTAR: PC → Git → Vercel

## ❌ PROBLEMA IDENTIFICADO

O projeto **NÃO está conectado ao Git** localmente.

Isso significa:
- ❌ Mudanças locais não vão para o Vercel automaticamente
- ❌ Você precisa fazer deploy manual toda vez
- ❌ Não há sincronização entre PC e Vercel

---

## ✅ SOLUÇÃO COMPLETA

### PASSO 1: Inicializar Git Local

```bash
# 1. Inicializar repositório
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer primeiro commit
git commit -m "Initial commit - Projeto controle de mesas"
```

### PASSO 2: Conectar ao Repositório Remoto (GitHub)

**Opção A: Se você já tem o repositório no GitHub (baseado na imagem do Vercel):**

```bash
# Adicionar remote (substitua pela URL do seu repositório)
git remote add origin https://github.com/stenin15/controle-de-mesas.git

# Verificar se conectou
git remote -v
```

**Opção B: Se NÃO tem repositório no GitHub:**

1. Acesse: https://github.com/new
2. Crie um repositório: `controle-de-mesas`
3. **NÃO** inicialize com README
4. Copie a URL do repositório
5. Execute:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/controle-de-mesas.git
   ```

### PASSO 3: Fazer Push para o GitHub

```bash
# Enviar código para o GitHub
git branch -M main
git push -u origin main
```

**Se pedir autenticação:**
- Use um **Personal Access Token** (não a senha)
- Ou configure SSH keys

### PASSO 4: Verificar Conexão Vercel → GitHub

1. **Acesse:** Vercel Dashboard → `controle-de-mesas` → **Settings**
2. **Vá em:** **Git**
3. **Verifique:** Deve mostrar o repositório conectado
4. **Se não estiver conectado:**
   - Clique em **"Connect Git Repository"**
   - Selecione o repositório `controle-de-mesas`
   - Autorize a conexão

### PASSO 5: Verificar Variáveis de Ambiente na Vercel

1. **Acesse:** Vercel Dashboard → `controle-de-mesas` → **Settings** → **Environment Variables**
2. **Verifique se existem estas 5 variáveis:**

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://orqrtobctdjxvygqfhee.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   JWT_SECRET=OXw6sbp4fSc8hGakyXG5pRfz21dfAIKqvYpUQHPlaMsvauHZR2X43g9QxXGp3Pdl/qn2PYai3J+/Mm02iuR/7g==
   NEXT_PUBLIC_BASE_URL=https://controle-de-mesas.vercel.app
   ```

3. **Se faltar alguma:**
   - Clique em **"Add"**
   - Adicione o nome e valor
   - Selecione **"Production"**, **"Preview"** e **"Development"**
   - Salve

### PASSO 6: Configurar Framework na Vercel

1. **Acesse:** Vercel Dashboard → `controle-de-mesas` → **Settings** → **General**
2. **Procure por:** **"Framework Preset"**
3. **Selecione:** **Next.js**
4. **Salve**

---

## 🎯 FLUXO COMPLETO (Após Configurar)

### Para Editar Localmente e Ver no Vercel:

1. **Edite arquivos no PC** (Cursor/VS Code)
2. **Faça commit:**
   ```bash
   git add .
   git commit -m "Descrição da mudança"
   git push
   ```
3. **Vercel detecta automaticamente** e faz deploy
4. **Aguarde ~30 segundos** → Pronto! 🚀

---

## ✅ CHECKLIST FINAL

- [ ] Git inicializado localmente (`git init`)
- [ ] Repositório remoto conectado (`git remote add origin`)
- [ ] Código enviado para GitHub (`git push`)
- [ ] Vercel conectado ao GitHub (Settings → Git)
- [ ] 5 variáveis de ambiente configuradas na Vercel
- [ ] Framework configurado como "Next.js" na Vercel
- [ ] Teste: Editar arquivo → Commit → Push → Ver no Vercel

---

## 🚨 COMANDOS RÁPIDOS

```bash
# Ver status do Git
git status

# Ver remotes configurados
git remote -v

# Adicionar mudanças
git add .

# Fazer commit
git commit -m "Sua mensagem"

# Enviar para GitHub
git push

# Ver logs
git log --oneline
```

---

**Execute os passos acima e tudo ficará conectado!** 🔗

