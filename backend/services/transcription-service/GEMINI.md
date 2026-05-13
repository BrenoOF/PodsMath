# Transcription Service - Project Overview

This is a specialized microservice for audio transcription, part of the PodsMath backend ecosystem. It handles audio uploads, storage, and asynchronous speech-to-text processing using Whisper.

## Core Technologies
- **Runtime:** Node.js
- **Framework:** Express.js
- **Transcription Engine:** `nodejs-whisper` (requires system-level Whisper dependencies)
- **Primary Storage (Audio):** MongoDB GridFS (for files > 16MB)
- **Metadata Storage:** MongoDB (via Mongoose)
- **Integration:** Communicates with a `user-service` (MySQL) via HTTP for core business data.

## Architecture & Workflow
1. **Upload:** Audio files are received via `POST /transcricao`, stored in MongoDB GridFS, and registered in the `user-service`.
2. **Queue:** A transcription job is added to an in-memory queue (`queueService`).
3. **Processing:** The queue processes jobs sequentially using `nodejs-whisper`. It tracks processing speed to provide estimated completion times.
4. **Completion:** Once transcribed, the text is sent back to the `user-service` to be saved in the MySQL database.
5. **Streaming:** Audio can be streamed directly from GridFS with support for `Range` requests (seeking).

## Project Structure
- `index.js`: Entry point, server initialization, and MongoDB connection.
- `routes/`: Express route definitions.
- `controllers/`: Request handling and coordination between services.
- `services/`: 
    - `queueService.js`: Manages the transcription queue and Whisper execution.
    - `audioService.js`: Handles GridFS operations and `user-service` API calls.
- `models/`: Mongoose schemas (e.g., `AudioMongo`).
- `db/`: Database connection logic.
- `middleware/`: Authentication and permissions logic.
- `uploads/`: Temporary directory for file processing.

## Building and Running

### Prerequisites
- Node.js installed.
- MongoDB instance running.
- `user-service` running (default: `http://localhost:3001`).
- Whisper system dependencies (if applicable for `nodejs-whisper`).

### Commands
- **Install Dependencies:** `npm install`
- **Start Service:** `npm start` (Runs on port 3002 by default)
- **Tests:** `npm test` (Currently not implemented)

### Configuration
The service expects a `.env` file at `../../config/.env`. Key variables include:
- `TRANSCRIPTION_SERVICE_PORT`: Port for this service (default: 3002).
- `USER_SERVICE_URL`: Base URL for the user/core service.
- `MONGO_URI`: MongoDB connection string.

## Development Conventions
- **Asynchronous Processing:** Long-running transcription tasks must always be queued and never block the main thread.
- **Service Communication:** Use the `audioService` for all external API calls and database interactions.
- **Error Handling:** Always log errors and clean up temporary files (in the `uploads/` folder) after processing, even on failure.
- **Streaming:** Ensure audio streaming routes support `Range` headers for a better user experience in players.
