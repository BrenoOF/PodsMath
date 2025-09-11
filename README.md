# PodsMath

Este é o README para o projeto PodsMath. Ele contém instruções sobre como configurar e executar o projeto.

## Configuração

### Backend

1.  **Variáveis de Ambiente:**
    *   Navegue até a pasta `backend/config`.
    *   Crie uma cópia do arquivo `.env.example` e renomeie para `.env`.
    *   Abra o arquivo `.env` e configure as variáveis de ambiente para a conexão com o banco de dados MySQL:
        ```
        DB_HOST="seu_host"
        DB_PORT="sua_porta"
        DB_USER="seu_usuario"
        DB_PASS="sua_senha"
        DB_NAME="seu_banco_de_dados"
        ```

2.  **Instalação das Dependências:**
    *   Abra um terminal em cada uma das pastas de serviço do backend (`gateway`, `services/transcription-service`, `services/user-service`).
    *   Execute o comando `npm install` em cada uma delas para instalar as dependências.

### Frontend

1.  **Instalação das Dependências:**
    *   Abra um terminal na pasta `frontend`.
    *   Execute o comando `npm install` para instalar as dependências.

## Executando o Projeto

### Backend

1.  **Iniciando os Serviços:**
    *   Abra um terminal em cada uma das pastas de serviço do backend (`gateway`, `services/transcription-service`, `services/user-service`).
    *   Execute o comando `npm start` em cada uma delas para iniciar os serviços.

### Frontend

1.  **Iniciando a Aplicação:**
    *   Abra um terminal na pasta `frontend`.
    *   Execute o comando `npm start` para iniciar a aplicação React.

## Testando as Rotas

Para testar as rotas da API, você pode usar uma ferramenta como o [Postman](https://www.postman.com/) ou o [Insomnia](https://insomnia.rest/).

As rotas da API são definidas nos arquivos de rotas dentro de cada serviço do backend. Por exemplo, as rotas de usuário estão em `backend/services/user-service/routes/usuarioRoutes.js`.

**Exemplo de como testar a rota de login de usuário:**

*   **Método:** `POST`
*   **URL:** `http://localhost:PORTA_DO_GATEWAY/user-service/login` (substitua `PORTA_DO_GATEWAY` pela porta em que o gateway está rodando)
*   **Corpo da Requisição (JSON):**
    ```json
    {
      "email": "seu_email@exemplo.com",
      "senha": "sua_senha"
    }
    ```

**Observação:** Verifique os arquivos de rotas em cada serviço para obter a lista completa de rotas e seus respectivos métodos e parâmetros.
