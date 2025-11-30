# Weather Challenge

Aplicação para consultar o clima atual de qualquer cidade, salvar histórico de consultas e comparar previsões entre diferentes localidades.

## 🚀 Tecnologias

### Backend
- Laravel 11
- PHP 8.4 (Docker)
- SQLite
- Weatherstack API
- API IBGE

### Frontend
- React 18
- Vite
- Tailwind CSS

## 📋 Pré-requisitos

- Docker e Docker Compose
- Conta gratuita na [Weatherstack](https://weatherstack.com) para obter API key

> **Nota:** Não é necessário ter PHP, Composer ou Node.js instalados localmente. Tudo roda dentro dos containers Docker.

## 🐳 Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/guto-welter/weather-challenge.git
cd weather-challenge
```

### 2. Configurar o Backend

```bash
cd backend-laravel
cp .env.example .env
```

Edite o `.env` e adicione sua chave da Weatherstack:
```env
WEATHERSTACK_KEY=sua_chave_aqui
```

### 3. Rodar toda a aplicação com Docker

Volte para a raiz do projeto e execute:

```bash
cd ..
sudo docker-compose up -d --build
```

O Docker automaticamente irá:

**Backend:**
- ✔ Instalar dependências do Laravel
- ✔ Gerar APP_KEY
- ✔ Criar o banco SQLite
- ✔ Executar migrations
- ✔ Criar storage link
- ✔ Iniciar o servidor (porta interna apenas)

**Frontend:**
- ✔ Instalar dependências do React
- ✔ Configurar proxy para o backend
- ✔ Iniciar servidor de desenvolvimento

**Aplicação disponível em: http://localhost:5173**

O backend roda internamente na rede Docker e não é exposto diretamente. O frontend faz proxy das requisições `/api` para o backend automaticamente.

## ✨ Funcionalidades

- ✔ Buscar clima atual por cidade
- ✔ Salvar histórico de consultas
- ✔ Comparar previsões de duas cidades
- ✔ Interface responsiva com Tailwind CSS
- ✔ Backend isolado em Docker

## 🏗️ Arquitetura

### Backend (Laravel)

```
backend-laravel/
 ├── app/
 │    ├── Http/Controllers/   # Entrada e saída das requisições
 │    ├── Services/            # Regras de negócio (Weatherstack, histórico)
 │    └── Models/              # Modelos do banco de dados
 ├── routes/api.php            # Rotas da API
 ├── database/                 # Migrations
 ├── Dockerfile
 └── docker-compose.yml
```

**Decisões de arquitetura:**
- Regras de negócio centralizadas em Services (controllers limpos)
- SQLite para simplicidade (rápido, leve, sem containers adicionais)
- API RESTful com rotas claras em inglês

### Frontend (React)

**Estrutura atual:** Lógica centralizada em `App.jsx` devido ao escopo pequeno do desafio.

**Para aplicações maiores**, a estrutura recomendada seria:
```
frontend/
 ├── src/
 │    ├── components/       # Componentes reutilizáveis
 │    ├── pages/            # Páginas principais
 │    ├── hooks/            # Lógica compartilhada
 │    ├── services/         # Comunicação com backend
 │    └── utils/            # Funções auxiliares
```

## 💡 Por que estas escolhas?

**Docker:** Elimina necessidade de configurar PHP/Composer localmente. Basta ter Docker instalado.

**React + Tailwind:** Interface dinâmica e responsiva. Blade é excelente para relatórios e páginas simples, mas React oferece melhor experiência para interação com usuário.

**SQLite:** Ideal para desenvolvimento e testes. Não requer configuração de servidor de banco de dados.
