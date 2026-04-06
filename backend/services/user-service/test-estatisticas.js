const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/estatisticas',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy-token-for-testing'
  }
};

console.log('Testando rota /estatisticas...\n');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\nResponse Body:');
    try {
      const jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData, null, 2));

      if (jsonData.totalPodcasts !== undefined && jsonData.totalUsuarios !== undefined) {
        console.log('\n✅ Teste passado! A rota retornou os dados esperados.');
      } else {
        console.log('\n❌ Teste falhou! A rota não retornou os dados esperados.');
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Erro ao conectar ao servidor:', error.message);
  console.log('\nℹ️  Certifique-se de que o servidor está rodando em localhost:3001');
  console.log('Execute: npm start');
});

req.end();
