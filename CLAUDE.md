# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PodsMath** is a full-stack educational application for transcribing audio into mathematical formulas and educational content. The application consists of a React frontend and a microservices backend architecture (Node.js + Express).

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       React Frontend                        │ (Port: default 3000)
│  - React 19.1.1 with React Router DOM v7                  │
│  - PrimeReact UI component library                          │
│  - Axios for API communication                              │
└─────────────────────────────────────────────────────────────┘
                                 ↑
┌─────────────────────────────────────────────────────────────┐
│                    Microservices Backend                    │
│                                                              │
│  ┌───────────────┐          ┌────────────────────────────┐│
│  │ user-service  │←────────→│ transcription-service      ││
│  │ Port: 3001    │          │ Port: 3002                 ││
│  └───────────────┘          └────────────────────────────┘│
│         ↓                           ↓                       │
│  ┌────────────────────┐    ┌─────────────────────┐        │
│  │ MySQL Database     │    │ MongoDB (metadata)  │        │
│  │ Main application   │    │ Transcription queue │        │
│  └────────────────────┘    └─────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Frontend (`/frontend`)

- **Framework**: React 19.1.1 with functional components
- **Routing**: React Router DOM v7
- **UI Components**: PrimeReact 10.9.7
- **Styling**: PrimeIcons 7.0.0
- **Notifications**: SweetAlert2
- **HTTP Client**: Axios

**Commands:**
- `npm install` - Install dependencies
- `npm start` - Run development server (starts on default port)
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend Services

Each backend service is an independent Express.js application that can be run separately.

Common setup for all services:
1. Navigate to the service directory
2. `npm install` (install dependencies)
3. `npm start` (run the service)

Environment configuration: `backend/config/.env` (copy from `.env.example`)

#### user-service (`/backend/services/user-service`)

Port: `3001` (from `USER_SERVICE_PORT` env var)

**Database**: MySQL (connection pool via mysql2/promise)

**Authentication**: JWT-based with configurable secret (`JWT_SECRET`)

**Authorization**: Role-based access control with granular permissions via `permissionsMiddleware`. Permission names are checked in the `config_nivel_acesso` table.

**Key Features**:
- User authentication and management
- Role-based permissions system
- Audio upload and management
- Transcription history and metadata
- User preferences (theme, language, etc.)
- Image processing (upload → WebP conversion)
- Audit logging
- Statistics tracking
- Favorite items

**Route Structure**: RESTful endpoints mounted on specific prefixes:
- `/auth` - Authentication endpoints
- `/usuarios` - User CRUD operations
- `/audios` - Audio file management
- `/transcricoes` - Transcription metadata
- `/auditorias` - Audit logs
- `/historicos` - User history
- `/idiomas` - Language settings
- `/imagens` - Image uploads (with WebP conversion)
- `/instituicoes` - Institution management
- `/niveis-acesso` - Access levels
- `/categorias` - Categories
- `/favoritos` - Favorites
- `/estatisticas` - Statistics
- `/categorias-nivel-acesso` - Category access levels
- `/config-nivel-acesso` - Access level configurations
- `/paletas-cor` - Color palettes
- `/temas` - Themes

**Image Upload Flow**:
1. Image uploaded via multer middleware
2. Sharp converts to WebP format
3. Stored in `/uploads/images/` directory with unique name
4. URLs exposed via static file serving

#### transcription-service (`/backend/services/transcription-service`)

Port: `3002` (from `TRANSCRIPTION_SERVICE_PORT` env var)

**Database**: MongoDB for storing transcription queue metadata (`MONGO_URI`)

**Features**:
- Audio file upload handling
- Audio transcription using Whisper AI (nodejs-whisper)
- Queue-based processing system
- Progress tracking
- Transcription status updates

**Routes**: `/transcricao` - endpoints related to transcription workflow

**Flow**:
1. Accept audio files (multiple formats)
2. Add to processing queue with MongoDB
3. Process via Whisper model
4. Update status throughout process (pending -> processing -> completed/failed)
5. Return transcription results

## Database Schema

### MySQL (`backend/Podsmath.sql`)

Core entities:
- `usuarios` - Users
- `audios` - Audio files
- `transcricoes` - Transcriptions
- `auditorias` - Audit trails
- `categorias` - Categories
- `favoritos` - User favorites
- `idiomas` - Languages
- `imagens` - Image metadata
- `instituicoes` - Institutions
- `nivel_acesso` - Access level definitions
- `categoria_nivel_acesso` - Access level categories
- `config_nivel_acesso` - Permission configurations
- `temas` - UI themes
- `paletas_cor` - Color palettes
- `historicos` - User history
- `estatisticas` - Usage statistics

### MongoDB

Stores transcription processing metadata for queue management.

## Environment Variables (`backend/config/.env`)

```bash
# MySQL Database
DB_HOST="localhost"
DB_PORT=3306
DB_USER="root"
DB_PASS="senha"
DB_NAME="podsmath"

# MongoDB
MONGO_URI="mongodb://localhost:27017/podsmath"

# JWT
JWT_SECRET="super_secreto_podsmath_2026"

# Email service
RESEND_API_KEY="api_key_resend"

# Service ports
TRANSCRIPTION_SERVICE_PORT=3002
USER_SERVICE_PORT=3001
USER_SERVICE_URL="http://localhost:3001"
```

## Development Workflow

### Initial Setup

1. Install global dependencies: `cd backend && npm run install-all`
2. Database setup: Import `backend/Podsmath.sql` into MySQL
3. Configure environment: Copy `backend/config/.env.example` to `backend/config/.env` and update values
4. Start MongoDB locally
5. Start all three services:
   - `cd backend/services/user-service && npm start`
   - `cd backend/services/transcription-service && npm start`
   - `cd frontend && npm start`

### Testing API Endpoints

Use Postman or Insomnia.

Example - User Login:
- **URL**: `http://localhost:3001/auth/login`
- **Method**: `POST`
- **Body**: `{"email": "user@example.com", "senha": "password"}`

All routes documented in individual service route files.

## Key Technical Decisions

- **Microservices**: User and transcription services are intentionally separated to allow independent scaling
- **Database splitting**: MySQL for relational data (users, access control), MongoDB for queue/flow data (transcription)
- **File handling**: Local file storage in `/uploads` directories, with image optimization
- **Queue system**: Custom queue implementation in transcription service for audio processing
- **Language**: Entire codebase uses Brazilian Portuguese for identifiers and UI text

## Important Notes

- All identifiers, route names, database columns, and UI text are in Portuguese
- Static files (uploaded images/audio) are served via Express static middleware
- Services communicate via HTTP APIs (no direct database sharing beyond the two planned databases)
- JWT tokens are passed via `Authorization: Bearer <token>` header or `?token` query parameter
- Connection pooling is used for MySQL (managed in `db/connections.js`)
- Transaction safety: MySQL operations use transactions with proper rollback on errors
- Permission checks happen via middleware before route handlers
