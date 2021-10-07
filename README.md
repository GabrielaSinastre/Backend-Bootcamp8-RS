# Rocketseat Bootcamp GoStack 8.0

Projeto desenvolvido para o Bootcamp GoStack 8.0 da Rocketseat e para estudos dos conceitos de backend e frontend.

## MÓDULO O1

Módulo para aprender alguns conceitos de rotas e de CRUD.

## MÓDULO 02

Implementação de um projeto backend, chamado GoBarber.

## Scripts

Para rodar o módulo 02 foram feitos os seguintes passos:

Instalar o yarn, para criar o arquivo package.json.

### `yarn init -y`

Instalar a dependência express no projeto.

### `yarn add express`

Para fazer a importação de módulos como o express no js (pois o node não faz), instalar o sucrase para funcionar junto com o nodemon.

### `yarn add sucrase nodemon -D`

Após instalar, bastar iniciar o servidor para executar a aplicação pelo script usando o comando, ou seja, para rodar o nodemon com o sucrase, usar:

### ` yarn sucrase-node src/server.js`

### `yarn nodemons`

## Instalação e Comandos para o Docker

Instalar o docker para manuseio dos containers, fazendo os passos próprios de cada SO.

Testar se o docker está funcionando:

### `docker help`

Criar serviço de Banco de Dados Postgres:
1- Criar um container a partir de uma imagem: (database pode ser substituído por outro nome, assim como a senha que pode ser diferente de docker)

### `docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres`

Listar os containers que estão ativos na máquina:

### `docker ps`

Listar os containers que estão na máquina, mesmo que não estejam ativos:

### `docker ps -a`

Postbird é uma boa interface para visualizar os bancos de dados criados.

Forçar o fechamento do docker

### `docker stop`

Iniciar o container caso ele seja fechado ou após reiniciar o computador: (o nome do container pode não ser database)

### `docker start database`

Visualizar erros do container: (o nome do container pode não ser database)

### `docker logs database`

## ESLint e Prettier

Para padronização do código, usar o ESLint e Prettier, então, segue a configuração para que ambos estejam configurados para trabalharem juntos:

1- Instalar o ESLint e o Prettier pelas extensões do VSCode.

2- Pelo terminal, para verificar se o código está seguindo os padrões eslint:

### `yarn add eslint -d`

3- Iniciar o ESLint

### `yarn eslint --init`

- To check syntax, find problem, and enforce code style
- JavaScript modules (import/export)
- None of these
- (barra de espaço para cancelar opção), Node
- Use a popular style guide
- Airbnb
- JavaScript
- Y

Como esse projeto usa yarn ao invés de npm, apagar o "package-lock json" e rodar o yarn para que ele reconheça o eslint (yarn-lock): yarn

no .eslinttc.js:
module.exports = {
env: {
es2021: true,
},
extends: ['airbnb-base', 'prettier'],
plugins: ['prettier'],
globals: {
Atomics: 'readonly',
SharedArrayBuffer: 'readonly',
},
parserOptions: {
ecmaVersion: 12,
sourceType: 'module',
},
rules: {
'prettier/prettier': 'error',
'class-methods-use-this': 'off',
'no-param-reassign': 'off',
camelcase: 'off',
'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
},
};

4- Instalar o Prettier

### `yarn add prettier eslint-config-prettier eslint-pluguin-prettier -D`

no .eslinttc.js:
extends: ['airbnb-base', 'prettier'],
plugins: ['prettier'],

criar um .prettierrc:
{
"singleQuote": true,
"trailingComma": "es5"
}

5- Aplicar ESLint no arquivo todo de uma vez:

### `yarn eslint --fix src --ext .js`

## Sequelize

Adicionar o Sequelize no projeto:

### `yarn add sequelize -D`

### `yarn add sequelize-cli -D`

Criar .sequelizerc e cofigurar os caminhos das pastas do projeto.

Adicionar dependências do postgres no sequelize:

### `yarn add pg pg-hstore`

## Configurar as Migrations:

Criar uma migration pelo sequelize:

### `yarn sequelize migration:create --name=create-users`

Rodar a migration e verificar se deu certo: (olhar no postbird se está ok)

### `yarn sequelize db:migrate`

Desfazer a última ou todas as migrations:

### `yarn sequelize db:migrate:undo`

### `yarn sequelize db:migrate:undo:all`

## Hash da Senha

Instalar a dependência:

### `yarn add bcrypt`

## Token para uma session / JWT

Instalar a dependência:

### `yarn add jsonwebtoken`

## Schema Validation |

Para validar dados de entrada, instalar:

### `yarn add yup`

## Multer

Para lidar com arquivos que não seja do tipo json, ou seja, do tipo multiplatform data

### `yarn add multer`

## Date-fns

Biblioteca para lidar com datas

### `yarn add date-fns@next`

## Configurar Mongodb - BD não relacional

Primeiro, criar uma imagem do container no docker:

### `docker run --name mongobarber -p 27017:27017 -d -t mongo`

Adicionar a dependência do MongoDB

### `yarn add mongoose`
