# Litomapa — Como rodar

Breve guia para executar a aplicação (API + Web). Explica os modos de desenvolvimento e produção, como criar o banco e os scripts disponíveis em [package.json](package.json).

## 1. Como rodar a aplicação em modo de desenvolvimento

- Variáveis de ambiente
	- Crie um arquivo `.env` na raiz ou exporte variáveis necessárias (ex.: `PORT`, `DATABASE_URL`, `JWT_SECRET`). A API usa `dotenv` no startup; ajuste conforme seu ambiente.

- Criar o banco de dados (migrate)
	- Rode: `npm run migrate`
	- Esse comando executa o script de migração em `backend/src/db/migrate.ts` e cria as tabelas iniciais.

- Rodar a aplicação em modo de desenvolvimento
	- Rodar somente a API (watch + nodemon): `npm run api:dev`
	- Rodar somente o servidor Web (Vite dev + build watch): `npm run web:dev`
	- Rodar ambos (API + Web simultâneos): `npm run dev`

## 2. Como rodar a aplicação em modo de produção

- Variáveis de ambiente
	- Configure variáveis em produção (ex.: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`).

- Criar o banco de dados (migrate)
	- Execute: `npm run migrate` para criar o esquema antes de iniciar a app em produção.

- Rodar a aplicação inteira em modo de produção
    - Execute: `npm run prod` para rodar a aplicação inteira em modo de produção.

## 3. Explicação isolada de cada comando (em `package.json`)

- `npm run dev`: executa `api:dev` e `web:dev` em paralelo (desenvolvimento completo).
- `npm run prod`: executa `api:prod` e `web:prod` em paralelo (produção completa).

- `npm run api:dev`: executa `api-build:dev` e roda a API em modo *Watch* em paralelo — ideal para desenvolver apenas o backend.
- `npm run api:prod`: executa `api-build:prod` e roda a API.

- `npm run migrate`: cria/atualiza o esquema SQLite conforme o script de migração.

- `npm run api-build:dev`: compila o backend em modo watch.
- `npm run api-build:prod`: compila o backend para produção.

- `npm run web:dev`: executa `web-build:dev` e inicia o servidor de desenvolvimento do frontend.
- `npm run web:prod`: executa `web-build:prod` e executa inicia o servidor do frontend em modo de produção.

- `npm run web-build:dev`: builda/compila o frontend em modo watch.
- `npm run web-build:prod`: builda/compila o frontend uma única vez.

## Passo-a-passo rápido para começar a desenvolver

1. Instale dependências:
    * Execute no terminal: `npm install`
2. Copie/adicione as variáveis de ambiente necessárias:
    * Usando como referência o arquivo `.env.example`, crie um arquivo `.env`.
    * Mantenha o arquivo `.env` na raiz do projeto.
    * Este `.env` é privado e não vai para o Github, não o compartilhe com ninguém!
3. Crie o banco e inicialize esquema:
    * Execute no terminal: `npm run migrate`
4. Inicie a aplicação em desenvolvimento:
    * Execute: `npm run dev` (ou apenas `npm run api:dev` / `npm run web:dev` conforme precisar).

Se quiser apenas testar a API já compilada localmente, rode `npm run api:prod` após `npm run api-build:prod`.