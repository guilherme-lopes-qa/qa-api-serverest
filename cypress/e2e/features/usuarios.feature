# language: pt

Funcionalidade: Gerenciamento de usuários na API ServeRest
  Como gestor
  Quero validar as operações de usuários em uma API pública
  Para garantir o comportamento esperado em fluxos positivos e negativos

  Contexto:
    Dado que a API ServeRest esteja disponível

  @positivo @usuarios
  Cenário: CT01 - FB - Cadastrar usuário com sucesso
    Quando realizo o cadastro de um usuário válido
    Então o usuário deve ser cadastrado com sucesso

  @alternativo @usuarios
  Cenário: CT02 - FA - Listar usuários cadastrados
    Quando consulto a lista de usuários
    Então a API deve retornar os usuários cadastrados

  @negativo @usuarios
  Cenário: CT03 - FE - Não permitir cadastro com e-mail já existente
    Dado que existe um usuário cadastrado
    Quando tento cadastrar outro usuário com o mesmo e-mail
    Então a API deve impedir o cadastro por e-mail duplicado

  @negativo @usuarios
  Cenário: CT04 - FE - Não permitir cadastro sem nome
    Quando tento cadastrar um usuário sem informar o nome
    Então a API deve retornar erro de campo obrigatório para nome