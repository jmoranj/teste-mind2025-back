# Tutorial Backend

## Requisitos
- Node.js instalado
- MySQL instalado e configurado
- NPM ou Yarn

## Passo a Passo

1. Instale as dependências necessárias:

```
npm install

```
README.md
Configure o Banco de Dados:
Crie um banco de dados MySQL
Configure as credenciais no arquivo .env (use o .env.example como base)
Execute as migrações do Prisma:

```
npx prisma migrate dev

```

Inicie o servidor em modo desenvolvimento:

```
npm run dev

```

