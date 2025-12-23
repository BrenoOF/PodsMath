# User Service

Este serviço é responsável pelo gerenciamento de usuários, autenticação e outras funcionalidades relacionadas ao usuário no projeto Podsmath.

## Configuração e Execução

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado
- [NPM](https://www.npmjs.com/) (geralmente vem com o Node.js)
- Um servidor de banco de dados MySQL em execução.

### Configuração do Ambiente
1.  **Variáveis de Ambiente:** Este serviço utiliza um arquivo de ambiente para configurar a conexão com o banco de dados. Certifique-se de que o arquivo `.env` exista na pasta `config` na raiz do projeto e que ele contenha as seguintes variáveis devidamente preenchidas:
    ```
    DB_HOST="seu_host_mysql"
    DB_PORT=3306
    DB_USER="seu_usuario"
    DB_PASS="sua_senha"
    DB_NAME="podsmath_db"
    ```

2.  **Instalação de Dependências:** Navegue até o diretório do `user-service` e instale as dependências:
    ```bash
    cd services/user-service
    npm install
    ```

### Execução
Para iniciar o serviço, execute o seguinte comando no diretório do `user-service`:

```bash
npm start
```

O serviço estará em execução em `http://localhost:3000` (ou na porta configurada no seu ambiente).

## Rotas da API

A seguir estão listadas todas as rotas disponíveis neste serviço.

### Rotas de Usuários (`/usuarios`)
| Método | Rota         | Descrição                    |
|--------|--------------|--------------------------------|
| GET    | `/`          | Lista todos os usuários.        |
| GET    | `/:id`       | Obtém um usuário pelo ID.     |
| POST   | `/`          | Cria um novo usuário.          |
| PUT    | `/:id`       | Atualiza um usuário pelo ID.  |
| DELETE | `/:id`       | Deleta um usuário pelo ID.    |

### Rotas de Áudio (`/audios`)
| Método | Rota         | Descrição                    |
|--------|--------------|--------------------------------|
| GET    | `/`          | Lista todos os áudios.          |
| GET    | `/:id`       | Obtém um áudio pelo ID.       |
| POST   | `/`          | Cria um novo áudio.            |
| PUT    | `/:id`       | Atualiza um áudio pelo ID.    |
| DELETE | `/:id`       | Deleta um áudio pelo ID.      |

### Rotas de Transcrição (`/transcricoes`)
| Método | Rota         | Descrição                       |
|--------|--------------|-----------------------------------|
| GET    | `/`          | Lista todas as transcrições.     |
| GET    | `/:id`       | Obtém uma transcrição pelo ID.  |
| POST   | `/`          | Cria uma nova transcrição.       |
| PUT    | `/:id`       | Atualiza uma transcrição pelo ID.|
| DELETE | `/:id`       | Deleta uma transcrição pelo ID. |

### Rotas de Auditoria (`/auditorias`)
| Método | Rota         | Descrição                    |
|--------|--------------|--------------------------------|
| GET    | `/`          | Lista todos os registros de auditoria. |
| GET    | `/:id`       | Obtém um registro de auditoria pelo ID. |
| POST   | `/`          | Cria um novo registro de auditoria. |
| PUT    | `/:id`       | Atualiza um registro de auditoria pelo ID. |
| DELETE | `/:id`       | Deleta um registro de auditoria pelo ID. |

### Rotas de Histórico (`/historicos`)
| Método | Rota         | Descrição                    |
|--------|--------------|--------------------------------|
| GET    | `/`          | Lista todos os registros de histórico. |
| GET    | `/:id`       | Obtém um registro de histórico pelo ID. |
| POST   | `/`          | Cria um novo registro de histórico. |
| PUT    | `/:id`       | Atualiza um registro de histórico pelo ID. |
| DELETE | `/:id`       | Deleta um registro de histórico pelo ID. |

### Rotas de Idioma (`/idiomas`)
| Método | Rota         | Descrição                    |
|--------|--------------|--------------------------------|
| GET    | `/`          | Lista todos os idiomas.        |
| GET    | `/:id`       | Obtém um idioma pelo ID.      |
| POST   | `/`          | Cria um novo idioma.           |
| PUT    | `/:id`       | Atualiza um idioma pelo ID.   |
| DELETE | `/:id`       | Deleta um idioma pelo ID.     |

### Rotas de Imagem (`/imagens`)
| Método | Rota         | Descrição                    |
|--------|--------------|--------------------------------|
| GET    | `/`          | Lista todas as imagens.        |
| GET    | `/:id`       | Obtém uma imagem pelo ID.     |
| POST   | `/`          | Cria uma nova imagem.          |
| PUT    | `/:id`       | Atualiza uma imagem pelo ID.  |
| DELETE | `/:id`       | Deleta uma imagem pelo ID.    |

### Rotas de Instituição (`/instituicoes`)
| Método | Rota         | Descrição                    |
|--------|--------------|--------------------------------|
| GET    | `/`          | Lista todas as instituições.   |
| GET    | `/:id`       | Obtém uma instituição pelo ID.|
| POST   | `/`          | Cria uma nova instituição.     |
| PUT    | `/:id`       | Atualiza uma instituição pelo ID.|
| DELETE | `/:id`       | Deleta uma instituição pelo ID. |

### Rotas de Nível de Acesso (`/niveis-acesso`)
| Método | Rota         | Descrição                       |
|--------|--------------|-----------------------------------|
| GET    | `/`          | Lista todos os níveis de acesso. |
| GET    | `/:id`       | Obtém um nível de acesso pelo ID. |
| POST   | `/`          | Cria um novo nível de acesso.    |
| PUT    | `/:id`       | Atualiza um nível de acesso pelo ID. |
| DELETE | `/:id`       | Deleta um nível de acesso pelo ID. |

### Rotas de Paleta de Cor (`/paletas-cor`)
| Método | Rota         | Descrição                       |
|--------|--------------|-----------------------------------|
| GET    | `/`          | Lista todas as paletas de cores. |
| GET    | `/:id`       | Obtém uma paleta de cores pelo ID. |
| POST   | `/`          | Cria uma nova paleta de cores.   |
| PUT    | `/:id`       | Atualiza uma paleta de cores pelo ID. |
| DELETE | `/:id`       | Deleta uma paleta de cores pelo ID. |

### Rotas de Tema (`/temas`)
| Método | Rota         | Descrição                    |
|--------|--------------|--------------------------------|
| GET    | `/`          | Lista todos os temas.          |
| GET    | `/:id`       | Obtém um tema pelo ID.        |
| POST   | `/`          | Cria um novo tema.             |
| PUT    | `/:id`       | Atualiza um tema pelo ID.     |
| DELETE | `/:id`       | Deleta um tema pelo ID.       |
