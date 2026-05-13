# **🎧 PodsMath**

O **PodsMath** é uma plataforma focada no ecossistema de podcasts, permitindo não apenas a reprodução e gerenciamento de áudios, mas também oferecendo um poderoso serviço de transcrição automatizada de episódios.  
Este projeto é dividido em uma interface moderna feita em **React** (Frontend) e uma arquitetura de microserviços no **Node.js** (Backend), utilizando bancos de dados **MySQL** (dados relacionais) e **MongoDB** (dados de transcrição e filas).

## **📋 Pré-requisitos e Requisitos do Sistema**

Antes de iniciar, você precisará ter as seguintes ferramentas instaladas no seu sistema operativo.

### **1\. Ferramentas de Desenvolvimento e Processamento de Áudio**

O serviço de transcrição depende de ferramentas nativas para processamento de áudio e compilação de bibliotecas pesadas. Em sistemas baseados em Debian/Ubuntu, instale-os com o comando abaixo:  
sudo apt update  
sudo apt install \-y ffmpeg cmake build-essential

* **ffmpeg**: Essencial para a conversão, extração e manipulação dos arquivos de áudio antes de serem enviados para a IA de transcrição.  
* **cmake e build-essential**: Necessários para compilar dependências nativas do Node.js (como pacotes que fazem interface em C/C++).

### **2\. Ambientes e Bancos de Dados**

* **Node.js** (Recomendado v18 LTS ou superior)  
* **MySQL** (Para o user-service)  
* **MongoDB** (Para o transcription-service armazenar documentos grandes)  
* **Git**

## **🚀 Passo a Passo de Configuração**

Siga os passos abaixo para configurar o ambiente de desenvolvimento localmente.

### **Passo 1: Clonar o repositório**

git clone \[https://github.com/seu-usuario/PodsMath.git\](https://github.com/seu-usuario/PodsMath.git)  
cd PodsMath

### **Passo 2: Configuração dos Bancos de Dados**

#### **MySQL (user-service)**

1. Inicie o seu servidor MySQL.  
2. Crie um banco de dados chamado podsmath.  
3. Importe o arquivo SQL fornecido no repositório para criar as tabelas estruturais:

mysql \-u seu\_usuario \-p podsmath \< backend/Podsmath.sql

#### **MongoDB (transcription-service)**

1. Certifique-se de que o MongoDB está rodando localmente (geralmente na porta 27017\) ou tenha a URI de um cluster (ex: MongoDB Atlas) em mãos.

### **Passo 3: Configuração do Backend (Serviços)**

O backend é dividido em dois serviços principais. É necessário configurar e instalar as dependências de ambos.

#### **3.1. User Service (Serviço de Usuários)**

Responsável pela autenticação, controle de acesso e dados relacionais.

1. Navegue até a pasta do serviço:

cd backend/services/user-service

2. Instale as dependências:

npm install

3. Configure as variáveis de ambiente:  
   * Volte para a pasta backend/config/ e copie o arquivo de exemplo:  
     cp ../config/.env.example .env

   * Edite o arquivo .env gerado com as credenciais do seu banco MySQL e sua chave JWT (JWT\_SECRET).

#### **3.2. Transcription Service (Serviço de Transcrição)**

Responsável por processar áudios e interagir com a IA (Gemini) para transcrição.

1. Navegue até a pasta do serviço:

cd ../transcription-service

2. Instale as dependências:

npm install

3. Configure as variáveis de ambiente (semelhante ao passo anterior, crie o .env desta pasta incluindo a MONGODB\_URI e as chaves de API necessárias para a transcrição \- ex: GEMINI\_API\_KEY).

### **Passo 4: Configuração do Frontend (React)**

1. Abra um novo terminal e navegue até a pasta do frontend:

cd frontend

2. Instale as dependências:

npm install

*(Nota: O frontend já possui um arquivo setupProxy.js configurado para rotear as requisições da API para os serviços de backend corretos durante o desenvolvimento local).*

## **💻 Executando a Aplicação**

Para rodar o projeto completamente no seu ambiente local, você precisará iniciar os três ambientes (em terminais separados):  
**Terminal 1: User Service**  
cd backend/services/user-service  
npm run dev  
\# ou npm start

**Terminal 2: Transcription Service**  
cd backend/services/transcription-service  
npm run dev  
\# ou npm start

**Terminal 3: Frontend**  
cd frontend  
npm start

Após iniciar o frontend, a aplicação estará disponível no seu navegador em: http://localhost:3000 (ou a porta padrão definida pelo React).

## **🛠️ Tecnologias Utilizadas**

* **Frontend**: React.js, CSS Modules  
* **Backend**: Node.js, Express.js  
* **Banco de Dados**: MySQL, MongoDB  
* **Processamento de Mídia**: FFmpeg  
* **IA/Transcrição**: Integração com API (Google Gemini)

**Desenvolvido com ❤️ para a comunidade PodsMath.**