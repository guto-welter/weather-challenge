Weather Challenge

Weather Challenge é uma aplicação que permite consultar o clima atual de qualquer cidade, salvar um histórico de consultas e comparar previsões entre diferentes localidades.

- **Frontend:** React + Tailwind CSS  
- **Backend:** Laravel 11 (100% rodando via Docker — sem precisar instalar PHP/Composer localmente)

Tecnologias Utilizadas

### **Backend**
- Laravel 11  
- PHP 8.4 (Docker)  
- SQLite  
- Weatherstack API
- API IBGE

**Frontend**
- React 18  
- Vite  
- Tailwind CSS  


# 🐳 Como Rodar o Backend (Laravel) com Docker

O backend é totalmente automatizado via Docker.  

##  1. Clonar o Repositório

git clone https://github.com/guto-welter/weather-challenge.git

cd weather-challenge

2. Configurar o .env

Entre na pasta do backend:

cd backend-laravel

cp .env.example .env

Edite o .env e coloque sua chave da Weatherstack:

WEATHERSTACK_KEY=sua_chave_aqui

Coloque também o database:

DB_DATABASE=database/database.sqlite

Se ainda não possui, crie uma conta gratuita em:

https://weatherstack.com

3. Subir o container Docker
4. 
Copiar código

sudo docker-compose up -d --build

Ao subir o container, o Docker automaticamente:

✔ Instala dependências do Laravel

✔ Gera APP_KEY

✔ Cria o banco SQLite

✔ Roda migrations

✔ Cria o storage link

✔ Sobe o servidor

Após iniciar, o backend ficará disponível em:

http://localhost:8000

Atente para porta estar disponível

 Como Rodar o Frontend (React + Tailwind)
 
Agora começamos o frontend:

cd ../frontend/react-app

1. Instalar dependências
2. 
npm install

3. Rodar o servidor de desenvolvimento
4. 
npm run dev

O frontend estará em:

 http://localhost:5173

Certifique-se de que o backend Docker esteja rodando.

 Funcionalidades
 
✔ Buscar clima atual por cidade

✔ Salvar histórico de consultas

✔ Comparar previsões de duas cidades

✔ Interface simples e responsiva com Tailwind

✔ Backend totalmente isolado em Docker

Observações:
Recomendado Node.js >= 22

Frontend utiliza Vite, por isso carrega rapidamente

Backend fica 100% isolado no container

Porque resolvi usar Docker?

- Optei por utilizar Docker para facilitar a execução do sistema. Assim, não é necessário configurar todo o ambiente PHP manualmente na máquina. Basta ter o Docker instalado e subir os containers para que tudo funcione automaticamente.
- 
Também optei por desenvolver o front-end em React e Tailwind para tornar a interface mais dinâmica e responsiva. Acredito que o Blade, do Laravel, é excelente para gerar relatórios e páginas simples; porém, quando se trata de interação direta com o usuário, ele acaba sendo mais limitado.

Backend (Laravel)

A estrutura do backend foi pensada para manter o código limpo, organizado e fácil de manter:

backend-laravel/

 ├── app/
 
 │    ├── Http/Controllers/   # Entrada e saída das requisições
 
 │    ├── Services/            # Regras de negócio (consulta Weatherstack, salvamento, histórico)
 
 │    ├── Models/              # Modelos do banco de dados
 
 │    └── ...
 
 ├── routes/api.php            # Rotas da API
 
 ├── database/                 # Migrations e seeds
 
 ├── Dockerfile
 
 └── docker-compose.yml
 
- Centralizei a regra de negócio em Services, deixando controllers mais limpos.
- 
- Usei SQLite por ser rápido, leve e não exigir mais containers no desafio, e também para salvar local, sem precisar configurar um banco por fora, algo assim.
- 
- Organizei a API com rotas claras: buscar clima, salvar histórico, listar histórico, comparar cidades.(usando padrão de linguagem inglês)


Como este desafio é focado em poucas telas, centralizei toda a lógica no arquivo App.jsx. Isso tornou o desenvolvimento mais rápido e direto, sem necessidade de uma estrutura complexa.

No entanto, se fosse uma aplicação maior, com navegação entre páginas, dashboards, histórico detalhado, gráficos, etc., eu organizaria o projeto seguindo uma arquitetura mais escalável, como:

frontend/

 ├── src/
 
 │    ├── components/       # Componentes reutilizáveis (cards, inputs, botões)
 
 │    ├── pages/            # Páginas principais (Home, Histórico, Comparação)
 
 │    ├── hooks/            # Lógica compartilhada (ex: ViaCEP)
 
 │    ├── services/         # Comunicação com o backend Laravel
 
 │    ├── utils/            # Funções auxiliares
 
 │    └── ...
 
 └── ...
Essa separação permite:

maior organização

reutilização de código

testes isolados

manutenção mais simples

escalabilidade conforme a aplicação cresce
