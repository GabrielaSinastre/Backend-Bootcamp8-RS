const express = require('express');

//instanciar a minha aplicação:
const server = express();
server.use(express.json());
console.log('conectado');
//pode receber 3 tipos de parâmetros:
//query params = ?teste=1 => $(nome)
//route params = /users/1   => /users/:id
//request body = { "name": "xxx", "email": "zzz"}

//  CRUD => CREATE, READ, UPDATE E DELETE

const users = [ 'Diego', 'Claudio', 'Victor'];

//middleware global, nao precisa usar server.get, tal tal
server.use((req, res, next) => {
  console.log('funcionou');
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();
  console.timeEnd('Request');
})

//middleware local, para verificar se um user ja existe
function checkUserExists(req, res, next) {
  if(!req.body.name) {
    return res.status(400).json( {error: 'User name is required'} );
  }
  return next();
}

//middleware que verifica se o index retorna um usuario realmente
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  
  if (!user) {
    return res.status(400).json( {error: 'User does not exists'} );
  }
//se ele encontrou um usuario:
  req.user = user;

  return next();
}

//obter todos os users
server.get('/users', (req, res) => {
  return res.json(users);
});

//localhost:3000/teste
//aqui eu estabeleço a minha rota com o servidor
server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
});

//criação de um novo user
server.post('/users', checkUserExists, checkUserInArray, (req, res) => {
  const { name } = req.body;

  users.push(name);
  
  return res.json(users);
});

//editar um user
server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

//deletar um user
server.delete('/users/:index', (req, res) => {
  const { index } = req.params;

  users.splice(index, 1); //splice percorre o vetor e deleta as posições a partir do paramentro, no caso, 1
  return res.json(users);
})

server.listen(3000);