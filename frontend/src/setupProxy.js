const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api-user',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: {
        '^/api-user': '', // remove /api-user do caminho final
      },
    })
  );

  app.use(
    '/api-transcription',
    createProxyMiddleware({
      target: 'http://localhost:3002',
      changeOrigin: true,
      pathRewrite: {
        '^/api-transcription': '', // remove /api-transcription do caminho final
      },
    })
  );
};
