FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache ffmpeg cmake build-base wget git
RUN npm ci --only=production
COPY . .

RUN cd node_modules/nodejs-whisper/cpp/whisper.cpp && \
    cmake -B build && \
    cmake --build build --config Release

CMD ["node", "index.js"]