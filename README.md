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
- Node.js >= 22
- Conta gratuita na [Weatherstack](https://weatherstack.com) para obter API key

## 🐳 Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/guto-welter/weather-challenge.git
cd weather-challenge
```

### 2. Configurar e rodar o Backend (Laravel)

```bash
cd backend-laravel
cp .env.example .env
```

Edite o `.env` e adicione sua chave da Weatherstack:
```env
WEATHERSTACK_KEY=sua_chave_aqui
```
E também o sqlite:
```env
DB_DATABASE=database/database.sqlite
```

Suba o container Docker:
```bash
sudo docker-compose up -d --build
```

O Docker automaticamente irá:
- ✔ Instalar dependências do Laravel
- ✔ Gerar APP_KEY
- ✔ Criar o banco SQLite
- ✔ Executar migrations
- ✔ Criar storage link
- ✔ Iniciar o servidor

Backend disponível em: **http://localhost:8000**

### 3. Rodar o Frontend (React)

Em outro terminal:

```bash
cd frontend/react-app
npm install
npm run dev
```

Frontend disponível em: **http://localhost:5173**

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
