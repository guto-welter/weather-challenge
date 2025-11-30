 # Weather Challenge

<p align="center">
  <img src="/frontend/react-app/src/assets/gif.gif" alt="Demonstrate" />
</p>

Aplicação para consultar o clima atual de qualquer cidade, salvar histórico de consultas e comparar previsões entre diferentes localidades.

## 🚀 Tecnologias

- **Backend:** Laravel 11 + PHP 8.4 + SQLite + Weatherstack API + API IBGE
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Infraestrutura:** Docker + Docker Compose

## 📋 Pré-requisitos

- Docker e Docker Compose
- Conta gratuita na [Weatherstack](https://weatherstack.com) para obter API key

## 🐳 Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/guto-welter/weather-challenge.git
cd weather-challenge
```

### 2. Configurar ambiente

```bash
cd backend-laravel
cp .env.example .env
```

Edite o `.env` e adicione sua chave da Weatherstack:
```env
WEATHERSTACK_KEY=sua_chave_aqui
DB_DATABASE=database/database.sqlite
```

### 3. Iniciar aplicação

```bash
docker-compose up -d --build
```

O Docker irá configurar automaticamente backend e frontend:
- ✔ Instalar dependências
- ✔ Configurar banco SQLite
- ✔ Executar migrations
- ✔ Iniciar servidores

**Acesse a aplicação em:** [http://localhost:5173](http://localhost:5173)

## ✨ Funcionalidades

- Buscar clima atual por cidade
- Salvar histórico de consultas
- Comparar previsões de duas cidades
- Interface responsiva

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

**Decisões:**
- Regras de negócio centralizadas em Services (controllers limpos)
- SQLite para simplicidade (sem containers adicionais)
- API RESTful com rotas claras

### Frontend (React)

```
frontend/react-app/
 ├── src/
 │    ├── components/       # Componentes reutilizáveis
 │    ├── services/         # Comunicação com backend
 │    └── App.jsx           # Componente principal
 ├── Dockerfile
 └── vite.config.js
```

**Decisões:**
- Estrutura simplificada para escopo do desafio
- Docker para consistência de ambiente
- Tailwind CSS para estilização rápida
