# 🔧 CORRIGIR FRAMEWORK NA VERCEL

## ❌ PROBLEMA IDENTIFICADO

Na seção **"Framework Settings"**, o **"Framework Preset"** está como:
- ❌ **"▲ Other"** (ERRADO)

Deveria ser:
- ✅ **"Next.js"**

Além disso, o **"Output Directory"** está incorreto:
- ❌ `'public' if it exists, or ':'` (ERRADO para Next.js)
- ✅ Deveria ser vazio ou `.next` (Next.js usa `.next` por padrão)

---

## ✅ SOLUÇÃO

### PASSO 1: Mudar Framework Preset

1. **Na seção "Framework Settings"**
2. **Clique no dropdown "Framework Preset"**
3. **Selecione:** **"Next.js"** (não "Other")
4. **Clique em "Save"**

### PASSO 2: Verificar Output Directory

Após selecionar "Next.js", o **Output Directory** deve mudar automaticamente para:
- `.next` (ou ficar vazio)

**Se não mudar automaticamente:**
1. **Ative o toggle "Override"** ao lado de "Output Directory"
2. **Deixe o campo vazio** ou coloque `.next`
3. **Clique em "Save"**

### PASSO 3: Verificar Build Command

Após selecionar "Next.js", o **Build Command** deve ser:
- `npm run build` (ou `next build`)

**Se estiver diferente:**
1. **Ative o toggle "Override"** ao lado de "Build Command"
2. **Coloque:** `npm run build`
3. **Clique em "Save"**

---

## 📋 CONFIGURAÇÃO CORRETA PARA NEXT.JS

Após corrigir, deve ficar assim:

```
Framework Preset: Next.js
Build Command: npm run build (ou next build)
Output Directory: .next (ou vazio)
Install Command: npm install (ou deixar padrão)
Development Command: next dev (ou deixar padrão)
```

---

## 🚀 APÓS CORRIGIR

1. **Salve as alterações**
2. **Faça um novo deploy** (ou aguarde o próximo push)
3. **Teste:** `https://controle-de-mesas.vercel.app/login`
4. **Deve funcionar!** ✅

---

## ✅ CHECKLIST

- [ ] Framework Preset mudado para "Next.js"
- [ ] Output Directory corrigido (`.next` ou vazio)
- [ ] Build Command verificado (`npm run build`)
- [ ] Alterações salvas
- [ ] Novo deploy feito
- [ ] Teste realizado

---

**Mude o Framework Preset para "Next.js" e salve!** 🎯


