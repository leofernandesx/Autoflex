# Configuração do GitHub

## Passos para fazer push no GitHub

### 1. Criar repositório no GitHub
1. Acesse https://github.com/new
2. Crie um novo repositório (ex: `Autoflex`)
3. **NÃO** inicialize com README, .gitignore ou license (já temos isso)
4. Copie a URL do repositório (ex: `https://github.com/seu-usuario/Autoflex.git`)

### 2. Adicionar remote do GitHub

```bash
cd "/home/leonardofernandes/Área de trabalho/Autoflex"
git remote add origin https://github.com/SEU-USUARIO/Autoflex.git
```

### 3. Verificar que está configurado corretamente

```bash
git remote -v
```

Deve mostrar:
```
origin  https://github.com/SEU-USUARIO/Autoflex.git (fetch)
origin  https://github.com/SEU-USUARIO/Autoflex.git (push)
```

### 4. Fazer push para o GitHub

```bash
git push -u origin main
```

## Verificação de segurança

Para garantir que NÃO está usando Bit:
- ✅ Verifique que a URL do remote começa com `https://github.com/` ou `git@github.com:`
- ❌ NÃO deve começar com `bitbucket.org` ou qualquer URL do Bit

## Comandos úteis

```bash
# Ver remotes configurados
git remote -v

# Remover remote (se necessário)
git remote remove origin

# Adicionar remote do GitHub
git remote add origin https://github.com/SEU-USUARIO/Autoflex.git

# Fazer push
git push -u origin main
```
