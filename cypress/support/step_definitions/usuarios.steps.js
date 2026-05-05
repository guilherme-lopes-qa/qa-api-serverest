const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');

let response;
let usuario;
let requestBody;

function gerarUsuarioValido() {
  const timestamp = Date.now();

  return {
    nome: `Usuario QA ${timestamp}`,
    email: `qa${timestamp}@teste.com`,
    password: 'teste123',
    administrador: 'true',
  };
}

Given('que a API ServeRest esteja disponível', () => {
  cy.exibirTelaExecucao('Verificando disponibilidade da API ServeRest');

  cy.request({
    method: 'GET',
    url: '/usuarios',
  }).then((res) => {
    expect(res.status).to.eq(200);
  });
});

When('realizo o cadastro de um usuário válido', () => {
  cy.exibirTelaExecucao('CT01 - FB - Cadastrar usuário com sucesso');

  usuario = gerarUsuarioValido();
  requestBody = usuario;

  cy.request({
    method: 'POST',
    url: '/usuarios',
    body: requestBody,
  }).then((res) => {
    response = res;
  });
});

Then('o usuário deve ser cadastrado com sucesso', () => {
  expect(response.status).to.eq(201);
  expect(response.body.message).to.eq('Cadastro realizado com sucesso');
  expect(response.body).to.have.property('_id');
  expect(response.body._id).to.not.be.empty;

  const resultado = {
    id: 'CT01',
    tipo: 'Fluxo Básico',
    cenario: 'Cadastrar usuário com sucesso',
    statusTeste: 'Aprovado',
    metodo: 'POST',
    endpoint: '/usuarios',
    statusHttp: response.status,
    validacoes: [
      'Status HTTP 201 validado',
      'Mensagem de sucesso validada',
      'ID do usuário validado',
    ],
    requestBody,
    responseBody: response.body,
    evidencia: '../screenshots/usuarios.feature/CT01-FB-Cadastrar-usuario-com-sucesso.png',
  };

  cy.registrarResultadoApi(resultado);

  cy.gerarEvidenciaApi({
    nomeArquivo: 'CT01-FB-Cadastrar-usuario-com-sucesso',
    titulo: 'CT01 - FB - Cadastrar usuário com sucesso',
    metodo: 'POST',
    endpoint: '/usuarios',
    status: response.status,
    requestBody,
    responseBody: response.body,
  });
});

When('consulto a lista de usuários', () => {
  cy.exibirTelaExecucao('CT02 - FA - Listar usuários cadastrados');

  requestBody = null;

  cy.request({
    method: 'GET',
    url: '/usuarios',
  }).then((res) => {
    response = res;
  });
});

Then('a API deve retornar os usuários cadastrados', () => {
  expect(response.status).to.eq(200);
  expect(response.body).to.have.property('quantidade');
  expect(response.body.quantidade).to.be.a('number');
  expect(response.body).to.have.property('usuarios');
  expect(response.body.usuarios).to.be.an('array');

  const resultado = {
    id: 'CT02',
    tipo: 'Fluxo Alternativo',
    cenario: 'Listar usuários cadastrados',
    statusTeste: 'Aprovado',
    metodo: 'GET',
    endpoint: '/usuarios',
    statusHttp: response.status,
    validacoes: [
      'Status HTTP 200 validado',
      'Campo quantidade validado',
      'Lista de usuários validada',
    ],
    requestBody,
    responseBody: {
      quantidade: response.body.quantidade,
      exemploPrimeiroRegistro: response.body.usuarios?.[0] || null,
    },
    evidencia: '../screenshots/usuarios.feature/CT02-FA-Listar-usuarios-cadastrados.png',
  };

  cy.registrarResultadoApi(resultado);

  cy.gerarEvidenciaApi({
    nomeArquivo: 'CT02-FA-Listar-usuarios-cadastrados',
    titulo: 'CT02 - FA - Listar usuários cadastrados',
    metodo: 'GET',
    endpoint: '/usuarios',
    status: response.status,
    requestBody,
    responseBody: resultado.responseBody,
  });
});

Given('que existe um usuário cadastrado', () => {
  cy.exibirTelaExecucao('Preparando massa de dados para cenário de e-mail duplicado');

  usuario = gerarUsuarioValido();
  requestBody = usuario;

  cy.request({
    method: 'POST',
    url: '/usuarios',
    body: requestBody,
  }).then((res) => {
    expect(res.status).to.eq(201);
  });
});

When('tento cadastrar outro usuário com o mesmo e-mail', () => {
  cy.exibirTelaExecucao('CT03 - FE - Não permitir cadastro com e-mail já existente');

  requestBody = usuario;

  cy.request({
    method: 'POST',
    url: '/usuarios',
    body: requestBody,
    failOnStatusCode: false,
  }).then((res) => {
    response = res;
  });
});

Then('a API deve impedir o cadastro por e-mail duplicado', () => {
  expect(response.status).to.eq(400);
  expect(response.body.message).to.eq('Este email já está sendo usado');

  const resultado = {
    id: 'CT03',
    tipo: 'Fluxo de Exceção',
    cenario: 'Não permitir cadastro com e-mail já existente',
    statusTeste: 'Aprovado',
    metodo: 'POST',
    endpoint: '/usuarios',
    statusHttp: response.status,
    validacoes: [
      'Status HTTP 400 validado',
      'Mensagem de e-mail duplicado validada',
      'Bloqueio de cadastro duplicado validado',
    ],
    requestBody,
    responseBody: response.body,
    evidencia: '../screenshots/usuarios.feature/CT03-FE-Nao-permitir-cadastro-email-duplicado.png',
  };

  cy.registrarResultadoApi(resultado);

  cy.gerarEvidenciaApi({
    nomeArquivo: 'CT03-FE-Nao-permitir-cadastro-email-duplicado',
    titulo: 'CT03 - FE - Não permitir cadastro com e-mail já existente',
    metodo: 'POST',
    endpoint: '/usuarios',
    status: response.status,
    requestBody,
    responseBody: response.body,
  });
});

When('tento cadastrar um usuário sem informar o nome', () => {
  cy.exibirTelaExecucao('CT04 - FE - Não permitir cadastro sem nome');

  requestBody = {
    email: `qa${Date.now()}@teste.com`,
    password: 'teste123',
    administrador: 'true',
  };

  cy.request({
    method: 'POST',
    url: '/usuarios',
    body: requestBody,
    failOnStatusCode: false,
  }).then((res) => {
    response = res;
  });
});

Then('a API deve retornar erro de campo obrigatório para nome', () => {
  expect(response.status).to.eq(400);
  expect(response.body).to.have.property('nome');
  expect(response.body.nome).to.eq('nome é obrigatório');

  const resultado = {
    id: 'CT04',
    tipo: 'Fluxo de Exceção',
    cenario: 'Não permitir cadastro sem nome',
    statusTeste: 'Aprovado',
    metodo: 'POST',
    endpoint: '/usuarios',
    statusHttp: response.status,
    validacoes: [
      'Status HTTP 400 validado',
      'Campo nome obrigatório validado',
      'Bloqueio de cadastro inválido validado',
    ],
    requestBody,
    responseBody: response.body,
    evidencia: '../screenshots/usuarios.feature/CT04-FE-Nao-permitir-cadastro-sem-nome.png',
  };

  cy.registrarResultadoApi(resultado);

  cy.gerarEvidenciaApi({
    nomeArquivo: 'CT04-FE-Nao-permitir-cadastro-sem-nome',
    titulo: 'CT04 - FE - Não permitir cadastro sem nome',
    metodo: 'POST',
    endpoint: '/usuarios',
    status: response.status,
    requestBody,
    responseBody: response.body,
  });
});