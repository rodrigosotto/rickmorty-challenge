# Rick & Morty Challenge

Este projeto é uma aplicação Angular que exibe personagens do universo Rick & Morty, com funcionalidades de busca, favoritos e responsividade.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão recomendada: 18.x ou superior)
- [npm](https://www.npmjs.com/) (geralmente instalado junto com o Node.js)
- [Angular CLI](https://angular.io/cli) (instale globalmente com `npm install -g @angular/cli`)

## Passo a passo para rodar localmente

1. **Clone o repositório**

   ```sh
   git clone https://github.com/rodrigosotto/rickmorty-challenge.git
   cd rickmorty-challenge
   ```

2. **Outra alternativa seria fazer o download do repositório**

- [Baixar repositório](https://github.com/rodrigosotto/rickmorty-challenge/archive/refs/heads/main.zip)

Descompactar o arquivo.zip baixado
cd rickmorty-challenge

3. **Instale as dependências**

   ```sh
   npm install
   ```

4. **Rodando a aplicação**

   ```sh
   ng serve
   ```

   Ou, alternativamente:

   ```sh
   npm start
   ```

5. **Acesse no navegador**
   - Abra [http://localhost:4200](http://localhost:4200)

## Estrutura do Projeto

- `src/app/components/character-list/` — Lista de personagens
- `src/app/components/favorites/` — Página de favoritos
- `src/app/app.routes.ts` — Rotas principais da aplicação

## Observações

- O projeto utiliza Angular, RxJS e SCSS.
- Para tradução, utilize o service i18n
- Para problemas com dependências, remova `node_modules` e rode `npm install` novamente.

## Scripts úteis

- `ng test` — Executa testes unitários
- `ng build` — Gera build de produção
- `ng lint` — Analisa o código com linter

---

## Deploy feito na Vercel

- (https://rickmorty-challenge.vercel.app/characters)

Se precisar de instruções para deploy ou integração, consulte a documentação Angular ou peça detalhes aqui, Valeu!
