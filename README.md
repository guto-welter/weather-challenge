#Weather Challenge — Documentação Completa

Este projeto consiste em uma aplicação para consultar o clima atual de qualquer cidade, salvar o histórico dessas consultas e comparar previsões entre duas localidades.
O frontend foi desenvolvido com HTML + CSS + jQuery, e o backend com Laravel (PHP).

Este README explica:
Como iniciar o projeto Laravel do zero
Requisitos mínimos
Como instalar dependências
Como configurar o ambiente
Como rodar o servidor
Como rodar migrations
Como usar o frontend

Após clonar o projeto, em seu terminal execute(estando na raiz do projeto):
- composer install
- cp .env.example .env
- php artisan key:generate
Em seu .env coloque:
- DB_CONNECTION=sqlite
- DB_DATABASE=./database/database.sqlite
Acesse: https://weatherstack.com
Crie uma conta (gratuita)
Pegue sua Access Key
- WEATHERSTACK_KEY: (sua key gerada no site)


Após isso, rode as migrations:
- php artisan migrate
Faça o link da storage:
- php artisan storage:link
Está pronto para iniciar o servidor local:
- php artisan serve

