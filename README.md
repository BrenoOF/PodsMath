# 🎧 PodsMath

O **PodsMath** é uma plataforma focada no ecossistema de podcasts, permitindo não apenas a reprodução e gerenciamento de áudios, mas também oferecendo um poderoso serviço de transcrição automatizada de episódios.

Este projeto é dividido em uma interface moderna feita em **React** (Frontend) e uma arquitetura de microserviços em **Node.js** (Backend), utilizando bancos de dados **MySQL** (dados relacionais) e **MongoDB** (dados de transcrição e filas).

---

## 📋 Pré-requisitos

Antes de iniciar, você precisará ter as seguintes ferramentas instaladas.

### Ferramentas de Desenvolvimento e Processamento de Áudio

O serviço de transcrição depende de ferramentas nativas para processamento de áudio e compilação de bibliotecas pesadas. Em sistemas baseados em Debian/Ubuntu:

```bash
sudo apt update
sudo apt install -y ffmpeg cmake build-essential
```

| Ferramenta | Finalidade |
|---|---|
| `ffmpeg` | Conversão, extração e manipulação de arquivos de áudio |
| `cmake` / `build-essential` | Compilação de dependências nativas do Node.js (C/C++) |

### Ambientes e Bancos de Dados

- **Node.js** v18 LTS ou superior
- **MySQL** — para o `user-service`
- **MongoDB** — para o `transcription-service`
- **Git**

---

## 🚀 Passo a Passo de Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/PodsMath.git
cd PodsMath
```

### 2. Configuração dos Bancos de Dados

#### MySQL (user-service)

1. Inicie o servidor MySQL.
2. Crie um banco de dados chamado `podsmath`.
3. Importe o schema:

```bash
mysql -u seu_usuario -p podsmath < backend/Podsmath.sql
```

#### MongoDB (transcription-service)

Certifique-se de que o MongoDB está rodando localmente (porta padrão `27017`) ou tenha a URI de um cluster em mãos (ex: MongoDB Atlas).

---

### 3. Configuração do Backend

O backend é dividido em dois serviços. Configure ambos antes de executar.

#### 3.1. User Service

Responsável pela autenticação, controle de acesso e dados relacionais.

```bash
cd backend/services/user-service
npm install
```

Configure as variáveis de ambiente:

```bash
cp ../config/.env.example .env
```

Edite o `.env` com as credenciais do MySQL e a chave `JWT_SECRET`.

#### 3.2. Transcription Service

Responsável por processar áudios e interagir com a IA (Gemini) para transcrição.

```bash
cd ../transcription-service
npm install
```

Crie o `.env` desta pasta incluindo:
- `MONGODB_URI`
- `GEMINI_API_KEY`

---

### 4. Configuração do Frontend

```bash
cd frontend
npm install
```

> **Nota:** O frontend já possui um `setupProxy.js` configurado para rotear as requisições para os serviços de backend durante o desenvolvimento local.

---

## 💻 Executando a Aplicação

Inicie os três serviços em terminais separados:

**Terminal 1 — User Service**
```bash
cd backend/services/user-service
npm run dev
```

**Terminal 2 — Transcription Service**
```bash
cd backend/services/transcription-service
npm run dev
```

**Terminal 3 — Frontend**
```bash
cd frontend
npm start
```

A aplicação estará disponível em: **http://localhost:3000**

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologias |
|---|---|
| Frontend | React.js, CSS Modules |
| Backend | Node.js, Express.js |
| Banco de Dados | MySQL, MongoDB |
| Processamento de Mídia | FFmpeg |
| IA / Transcrição | Google Gemini API |

---

<p align="center">Desenvolvido com ❤️ para a comunidade PodsMath.</p>
