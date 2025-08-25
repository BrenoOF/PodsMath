# Models

Este diretório contém os modelos de dados para o serviço de usuário. Cada modelo é responsável por interagir com uma tabela específica no banco de dados.

## Como Testar

Para testar os modelos, você pode criar um arquivo de teste e usar os métodos de cada modelo para interagir com o banco de dados.

### 1. Configuração do Banco de Dados

Antes de começar, certifique-se de que a conexão com o banco de dados está configurada corretamente no arquivo `services/user-service/db/connections.js`.

### 2. Criando um Arquivo de Teste

Crie um arquivo de teste (por exemplo, `test.js`) na raiz do serviço de usuário (`services/user-service`).

```javascript
// services/user-service/test.js

const Usuario = require('./models/usuarioModel');

async function testUsuarioModel() {
  try {
    // Teste de criação de usuário
    console.log('Criando um novo usuário...');
    const novoUsuario = await Usuario.create({
      idusuarios: 'auth0|123456789',
      instituicoes_idinstituicoes: 1,
      nome: 'Usuário de Teste',
      email: 'teste@example.com',
      senha: 'senha_super_segura',
      id_usuario_professor: null,
      nivel_acesso_idnivel_acesso: 1,
      paletaCor_idpaletaCor: 1,
      audiosEscutados: 0,
    });
    console.log('Usuário criado:', novoUsuario);

    // Teste de busca de usuário por ID
    console.log('\nBuscando usuário por ID...');
    const usuarioBuscado = await Usuario.getById(novoUsuario.idusuarios);
    console.log('Usuário encontrado:', usuarioBuscado);

    // Teste de listagem de todos os usuários
    console.log('\nListando todos os usuários...');
    const todosUsuarios = await Usuario.getAll();
    console.log('Todos os usuários:', todosUsuarios);

    // Teste de atualização de usuário
    console.log('\nAtualizando usuário...');
    const atualizado = await Usuario.update(novoUsuario.idusuarios, {
      nome: 'Usuário de Teste Atualizado',
    });
    console.log('Usuário atualizado com sucesso:', atualizado);

    // Teste de exclusão de usuário
    console.log('\nExcluindo usuário...');
    const excluido = await Usuario.delete(novoUsuario.idusuarios);
    console.log('Usuário excluído com sucesso:', excluido);

  } catch (error) {
    console.error('Erro durante os testes:', error);
  }
}

testUsuarioModel();
```

### 3. Executando os Testes

Para executar os testes, navegue até o diretório do serviço de usuário e execute o arquivo de teste com o Node.js.

```bash
cd services/user-service
node test.js
```

Isso executará as funções de teste e você verá a saída no console, permitindo verificar se os métodos do modelo estão funcionando como esperado.
