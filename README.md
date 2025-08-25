# PodsMath
Um sistema gerenciador de ensino de matemática por meio de PodCast's

## Getting Started

Siga estas instruções para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

* Node.js (v14 ou superior)
* npm (v6 ou superior)

### Instalação

1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/PodsMath.git
   ```
2. Instale as dependências do backend:
   ```sh
   cd backend/gateway
   npm install
   cd ../services/transcription-service
   npm install
   cd ../user-service
   npm install
   ```
3. Instale as dependências do frontend:
   ```sh
   cd ../../../frontend
   npm install
   ```

### Configuração de Ambiente

1. No diretório `backend/config`, renomeie o arquivo `.env.example` para `.env`.
2. Abra o arquivo `.env` e preencha as variáveis de ambiente necessárias.

### Executando o Projeto

1. Inicie os serviços do backend:
   ```sh
   cd backend/gateway
   npm start
   cd ../services/transcription-service
   npm start
   cd ../user-service
   npm start
   ```
2. Inicie o frontend:
   ```sh
   cd ../../../frontend
   npm run dev
   ```

Abra seu navegador e acesse `http://localhost:5173` para ver a aplicação.