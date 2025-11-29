Weather Challenge — Documentação Completa

Weather Challenge é uma aplicação para consultar o clima atual de qualquer cidade, salvar o histórico dessas consultas e comparar previsões entre duas localidades.

Frontend: React + Tailwind CSS

Backend: Laravel (PHP 8.4)

Este README explica passo a passo como iniciar o projeto, tanto o backend quanto o frontend.

Requisitos

Antes de começar, certifique-se de ter instalado:

PHP >= 8.4

Composer

Node.js >= 22

NPM

SQLite

Backend (Laravel)

O backend é responsável por fornecer a API que o frontend consome.

Passo 1: Clonar o repositório
git clone https://github.com/guto-welter/weather-challenge.git
cd weather-challenge/backend-laravel

Passo 2: Instalar dependências
composer install

Passo 3: Configurar o ambiente
cp .env.example .env
php artisan key:generate


Edite o arquivo .env para configurar o banco de dados SQLite:

DB_CONNECTION=sqlite
DB_DATABASE=./database/database.sqlite


Certifique-se de criar o arquivo database/database.sqlite se ele não existir:

touch database/database.sqlite

Passo 4: Configurar a API do clima

Acesse Weatherstack
, crie uma conta gratuita e obtenha sua Access Key.
Adicione no .env:

WEATHERSTACK_KEY=SuaAccessKeyAqui

Passo 5: Rodar migrations
php artisan migrate

Passo 6: Criar link da storage
php artisan storage:link

Passo 7: Rodar o servidor local
php artisan serve


O backend estará disponível em http://127.0.0.1:8000.

Frontend (React + Tailwind CSS)

O frontend consome a API Laravel e exibe a interface para o usuário.

Passo 1: Navegar até a pasta do frontend
cd ../frontend/react-app

Passo 2: Instalar dependências
npm install

Passo 3: Rodar o servidor de desenvolvimento
npm run dev


O frontend estará disponível em http://localhost:5173 (ou outra porta exibida no terminal).

Certifique-se de que o backend Laravel esteja rodando antes de testar o frontend.

Uso

Abra o frontend no navegador.

Busque uma cidade para ver o clima atual.

Salve consultas e compare previsões entre diferentes cidades.

Observações

Este projeto usa React 18 e Tailwind CSS 3.x.

Recomenda-se Node >= 22 para evitar problemas de compatibilidade com dependências modernas.
