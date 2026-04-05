# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the user-service for Podsmath - an Express.js-based REST API service that handles user management, authentication, and various entity operations.

## Required Commands

- **Install dependencies**: `npm install`
- **Start service**: `npm start` (runs on PORT from environment or 3001)
- **Environment file**: Located at `../../config/.env` with database connection variables

## Architecture

### Express.js MVC Pattern

Standard MVC architecture where each entity has:
- **Routes (`/routes/*.js`)**: Define HTTP endpoints and map to controller methods
- **Controllers (`/controllers/*.js`)**: Handle business logic
- **Models (`/models/*.js`)**: Handle database operations

### Entry Point

- **index.js**: Main Express app configuration
  - Mounts all route modules under respective URL prefixes
  - Configures CORS, body parsers (JSON/urlencoded, 50MB limit)
  - Serves static files from `/uploads` directory

### Database Layer

- **MySQL2/promise** with connection pooling via `db/connections.js`
- Transactions are used in model methods - always use `connection.beginTransaction()`, `commit()`, and `rollback()`
- Connection pool configuration defined in db/connections.js, loads DB credentials from `../../config/.env`

### Authentication & Authorization

- **JWT-based authentication**: token passed in `Authorization` header as `Bearer <token>` or as `?token` query parameter
- **authMiddleware.js**: Verifies JWT and injects decoded user data into `req.usuario`
- **permissionsMiddleware.js**: Fine-grained authorization system
  - Checks against `config_nivel_acesso` table for the currently authenticated user
  - Use by calling `permissionsMiddleware('nomeconfig')` where 'nomeconfig' is a permission name
  - Query path: `usuarios` → `nivel_acesso` → `categoria_nivel_acesso` → `config_nivel_acesso`

### Key Middleware

- **uploadMiddleware.js**: Handles image upload processing
  - Uses multer with memory storage (buffer-based)
  - Sharp for image conversion to WebP format
  - Stores files in `/uploads/images/` with unique filenames

## API Route Structure

All routes follow RESTful convention:
- GET `/`: List all entities
- GET `/:id`: Get entity by ID
- POST `/`: Create new entity
- PUT `/:id`: Update entity by ID
- DELETE `/:id`: Delete entity by ID

Mounted routes in index.js:
- `/auth` - Authentication endpoints
- `/usuarios` - User management
- `/audios` - Audio resources
- `/transcricoes` - Transcription resources
- `/auditorias` - Audit logs
- `/historicos` - User history
- `/idiomas` - Language settings
- `/imagens` - Image resources
- `/instituicoes` - Institution management
- `/niveis-acesso` - Access levels
- `/paletas-cor` - Color palette settings
- `/temas` - Theme management
- `/categorias` - Category management
- `/favoritos` - Favorites
- `/categorias-nivel-acesso` - Category access levels
- `/config-nivel-acesso` - Access level configurations

## Environment Variables Required

Located in `../../config/.env`:
- `DB_HOST` - MySQL host
- `DB_PORT` - MySQL port
- `DB_USER` - MySQL username
- `DB_PASS` - MySQL password
- `DB_NAME` - Database name (podsmath_db)
- `USER_SERVICE_PORT` - Port for this service (default: 3001)
- `JWT_SECRET` - JWT signing secret
