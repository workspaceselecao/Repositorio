# 🚀 Guia do Auto Commit

## 📋 Visão Geral

Sistema automatizado para fazer commits e push no Git com facilidade através do VS Code.

## 🛠️ Como Usar

### **1. Via VS Code (Recomendado)**

1. **Abra o Command Palette**: `Ctrl+Shift+P` (Windows/Linux) ou `Cmd+Shift+P` (Mac)
2. **Digite**: `Tasks: Run Task`
3. **Selecione**: `Auto Commit`
4. **Digite sua mensagem de commit**
5. **Pressione Enter**

### **2. Via Terminal**

**Windows (PowerShell):**
```powershell
# Usar o script PowerShell
.\auto-commit.ps1 "sua mensagem de commit"
```

**Linux/Mac (Bash):**
```bash
# Usar o script bash
./auto-commit.sh "sua mensagem de commit"
```

## 📊 Tarefas Disponíveis

| Tarefa | Descrição |
|--------|-----------|
| **Auto Commit (PowerShell)** | Adiciona, commita e faz push (Windows) |
| **Auto Commit (Bash)** | Adiciona, commita e faz push (Linux/Mac) |
| **Git Status** | Mostra o status do repositório |
| **Git Add All** | Adiciona todos os arquivos modificados |
| **Git Commit** | Faz commit com mensagem personalizada |
| **Git Push** | Faz push para o repositório remoto |
| **Deploy Vercel** | Faz deploy para produção no Vercel |

## 🎯 Funcionalidades do Auto Commit

### **O que o script faz:**

1. ✅ **Verifica** se é um repositório Git válido
2. ✅ **Detecta** mudanças nos arquivos
3. ✅ **Adiciona** todos os arquivos modificados (`git add -A`)
4. ✅ **Faz commit** com sua mensagem
5. ✅ **Faz push** para o repositório remoto
6. ✅ **Mostra** resumo do que foi feito

### **Exemplo de uso:**

```bash
./auto-commit.sh "feat: Adicionar nova funcionalidade de usuários"
```

**Resultado:**
```
🚀 Iniciando Auto Commit...
📝 Mensagem: feat: Adicionar nova funcionalidade de usuários
📊 Status do repositório:
 M src/components/UserManagement.jsx
 A src/app/api/create-user/route.js
➕ Adicionando arquivos...
✅ Arquivos adicionados com sucesso
💾 Fazendo commit...
✅ Commit realizado com sucesso
📤 Fazendo push...
✅ Push realizado com sucesso
🎉 Auto Commit concluído com sucesso!
```

## 🔧 Configuração

### **Arquivos criados:**

- `auto-commit.sh` - Script principal
- `.vscode/tasks.json` - Configuração das tarefas do VS Code
- `AUTO_COMMIT_GUIDE.md` - Este guia

### **Permissões:**

O script já está configurado com permissões de execução:
```bash
chmod +x auto-commit.sh
```

## ⚠️ Requisitos

- **Git** instalado e configurado
- **Repositório remoto** configurado (origin/master)
- **VS Code** (para usar as tarefas)
- **Terminal** com suporte a bash (para usar o script)

## 🚨 Tratamento de Erros

O script trata os seguintes cenários:

- ❌ **Sem mensagem de commit** - Solicita mensagem
- ❌ **Não é repositório Git** - Informa erro
- ❌ **Nenhuma mudança** - Não faz nada
- ❌ **Erro no commit** - Para e informa erro
- ❌ **Erro no push** - Sugere push manual

## 💡 Dicas de Uso

### **Mensagens de Commit:**

Use o padrão de mensagens semânticas:
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes

### **Exemplos:**

```bash
./auto-commit.sh "feat: Implementar sistema de autenticação"
./auto-commit.sh "fix: Corrigir erro na criação de usuários"
./auto-commit.sh "docs: Atualizar README com novas instruções"
./auto-commit.sh "style: Ajustar layout da sidebar"
```

## 🎉 Benefícios

- ⚡ **Rapidez** - Um comando faz tudo
- 🔒 **Segurança** - Verificações automáticas
- 📝 **Consistência** - Padrão de commits
- 🚀 **Produtividade** - Menos tempo, mais código
- 🛡️ **Confiabilidade** - Tratamento de erros

---

**Agora você pode fazer commits de forma rápida e eficiente!** 🚀
