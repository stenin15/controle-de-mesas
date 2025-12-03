# ⚡ REDEPLOY RÁPIDO NA VERCEL

## 🚀 OPÇÃO 1: REDEPLOY MANUAL (MAIS RÁPIDO - 30 segundos)

1. **Acesse:** https://vercel.com/dashboard
2. **Clique no projeto:** `controle-de-mesas`
3. **Vá em:** **Deployments** (menu lateral)
4. **Clique nos 3 pontos** (⋮) do último deployment
5. **Selecione:** **Redeploy**
6. **Confirme:** Clique em **Redeploy** novamente
7. **Aguarde:** 2-3 minutos para o deploy terminar

✅ **Pronto!** O sistema será atualizado automaticamente.

---

## 🔄 OPÇÃO 2: VIA GIT (Se tiver repositório)

Se você tiver um repositório Git conectado:

```bash
git add .
git commit -m "Atualização para produção"
git push
```

A Vercel detecta automaticamente e faz deploy.

---

## ⚙️ OPÇÃO 3: VIA VERCEL CLI (Precisa login)

```bash
# 1. Fazer login
vercel login

# 2. Deploy
vercel --prod
```

---

## ✅ APÓS O REDEPLOY

1. Aguarde o deploy terminar (status: "Ready")
2. Acesse: **https://controle-de-mesas.vercel.app/login**
3. Teste o login:
   - Email: `admin@evento.com`
   - Senha: `admin123`

---

## 🐛 SE O DEPLOY FALHAR

1. Vercel Dashboard → Deployments
2. Clique no deployment que falhou
3. Veja os **Build Logs** para identificar o erro
4. Verifique se todas as **variáveis de ambiente** estão configuradas

---

**RECOMENDAÇÃO:** Use a **OPÇÃO 1** (Redeploy Manual) - é a mais rápida e simples! 🚀

