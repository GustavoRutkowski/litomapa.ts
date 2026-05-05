# Litomapa — Como rodar

Breve guia para executar a aplicação (API + Web). Explica os scripts disponíveis em [package.json](package.json) e como começar a trabalhar na aplicação.

## Sumário

- [Scripts NPM em `package.json`](#scripts-npm-em-packagejson)
- [Passo-a-passo rápido para começar a desenvolver](#passo-a-passo-rápido-para-começar-a-desenvolver)

## Scripts NPM em `package.json`

| Comando                  | O que faz                                                                             |
| :----------------------- | :------------------------------------------------------------------------------------ |
| `npm run dev`            | executa `api:dev` e `web:dev` em paralelo (desenvolvimento completo).                 |
| `npm run prod`           | executa `api:prod` e `web:prod` em paralelo (produção completa).                      |
| `npm run api:dev`        | executa `api-build:dev` e roda a API em modo watch em paralelo.                       |
| `npm run api:prod`       | executa `api-build:prod` e roda a API.                                                |
| `npm run migrate`        | cria/atualiza o esquema do banco de dados.                                            |
| `npm run api-build:dev`  | compila o backend em modo watch.                                                      |
| `npm run api-build:prod` | compila o backend uma única vez.                                                      |
| `npm run web:dev`        | executa `web-build:dev` e inicia o servidor de desenvolvimento do frontend.           |
| `npm run web:prod`       | executa `web-build:prod` e executa inicia o servidor do frontend em modo de produção. |
| `npm run web-build:dev`  | builda o frontend em modo watch.                                                      |
| `npm run web-build:prod` | builda o frontend uma única vez.                                                      |
| `npm run lint`           | mostra todos os erros de lint no projeto.                                             |
| `npm run lint:fix`       | menta corrigir os problemas de lint do projeto.                                       |
| `npm run format`         | formata os arquivos do projeto.                                                       |
| `npm run format:check`   | checa se os arquivos do projeto estão formatados.                                     |
| `npm run prepare`        | habilita o pre-commit Husky no projeto.                                               |

## Passo-a-passo rápido para começar a desenvolver

1. Instale dependências:
    - Execute no terminal: `npm install`
2. Habilitar o Husky:
    - Execute no terminal: `npm run prepare` ou `npx husky`
3. Copie/adicione as variáveis de ambiente necessárias:
    - Usando como referência o arquivo `.env.example`, crie um arquivo `.env`.
    - Mantenha o arquivo `.env` na raiz do projeto.
    - Este `.env` é privado e não vai para o Github, não o compartilhe com ninguém!
4. Crie o banco e inicialize esquema:
    - Execute no terminal: `npm run migrate`
5. Inicie a aplicação em desenvolvimento:
    - Execute: `npm run dev` (ou o script de inicialização que preferir).

Se quiser apenas testar a API já compilada localmente, rode `npm run api:prod` após `npm run api-build:prod`.
