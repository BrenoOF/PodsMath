const express = require('express');

const app = express();

app.use(express.json());

app.listen(3002, () => {
    console.log('Transcription Service rodando na porta 3002');
});