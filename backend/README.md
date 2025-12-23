# Podsmath-Backend

Este é o backend do projeto Podsmath, composto por uma arquitetura de microserviços.

## Serviços

O backend é dividido nos seguintes serviços:

- **user-service**: Responsável pelo gerenciamento de usuários, autenticação e outras funcionalidades relacionadas ao usuário.
- **audio-service**: Responsável pelo processamento e armazenamento de áudios.
- **transcription-service**: Responsável por realizar a transcrição dos áudios.

## Configuração e Execução

Para configurar e executar cada serviço, siga as instruções abaixo.

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [NPM](https://www.npmjs.com/) (geralmente vem com o Node.js)

### Configuração do Ambiente (.env)

Para configurar as variáveis de ambiente globais, copie o arquivo `config/.env.example` para `config/.env` e preencha com os valores apropriados.

Exemplo de `config/.env`:

```
# Configuração do banco Mysql
DB_HOST = "localhost"
DB_PORT = 3306
DB_USER = "my_user"
DB_PASS = "my_password"
DB_NAME = "db_name"
```

### Instalação de Dependências

Para instalar as dependências de todos os serviços, execute o seguinte comando na raiz do projeto:

```bash
npm run install-all
```

**Nota**: Este comando assume que o script `install-all` está configurado no `package.json` principal para iterar sobre os diretórios dos serviços e instalar suas dependências.

### 1. user-service

**Configuração:**

Este serviço utiliza as variáveis de ambiente configuradas no arquivo `config/.env` global para a conexão com o banco de dados. Certifique-se de que as credenciais do MySQL estejam preenchidas corretamente nesse arquivo.

**Execução:**

Navegue até o diretório do serviço e execute o seguinte comando:

```bash
cd services/user-service
npm start
```

O serviço estará em execução em `http://localhost:3000` (ou na porta configurada no seu ambiente).

### 2. audio-service

**Execução:**

Navegue até o diretório do serviço e execute o seguinte comando:

```bash
cd services/audio-service
npm start
```

### 3. transcription-service

**Execução:**

Navegue até o diretório do serviço e execute o seguinte comando:

```bash
cd services/transcription-service
npm start
```