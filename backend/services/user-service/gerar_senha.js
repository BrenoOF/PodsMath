// arquivo: gerar_senha.js
const bcrypt = require('bcrypt');

async function gerarHash() {
    const senhaPlana = '159753br!?';
    const saltRounds = 10; // Verifique no seu projeto se o número de rounds é esse

    try {
        const hash = await bcrypt.hash(senhaPlana, saltRounds);
        console.log('--- Copie o hash abaixo ---');
        console.log(hash);
        console.log('---------------------------');
    } catch (error) {
        console.error('Erro ao gerar o hash:', error);
    }
}

gerarHash();