require('dotenv').config({ path: '../../config/.env' });
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const audioRoutes = require('./routes/audioRoutes');
const auditoriaRoutes = require('./routes/auditoriaRoutes');
const historicoRoutes = require('./routes/historicoRoutes');
const idiomaRoutes = require('./routes/idiomaRoutes');
const imagemRoutes = require('./routes/imagemRoutes');
const instituicaoRoutes = require('./routes/instituicaoRoutes');
const nivelAcessoRoutes = require('./routes/nivelAcessoRoutes');
const paletaCorRoutes = require('./routes/paletaCorRoutes');
const temaRoutes = require('./routes/temaRoutes');
const transcricaoRoutes = require('./routes/transcricaoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const favoritoRoutes = require('./routes/favoritoRoutes');
const categoriaNivelAcessoRoutes = require('./routes/categoriaNivelAcessoRoutes');
const configNivelAcessoRoutes = require('./routes/configNivelAcessoRoutes');

const app = express();
const PORT = process.env.USER_SERVICE_PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/audios', audioRoutes);
app.use('/auditorias', auditoriaRoutes);
app.use('/historicos', historicoRoutes);
app.use('/idiomas', idiomaRoutes);
app.use('/imagens', imagemRoutes);
app.use('/instituicoes', instituicaoRoutes);
app.use('/niveis-acesso', nivelAcessoRoutes);
app.use('/paletas-cor', paletaCorRoutes);
app.use('/temas', temaRoutes);
app.use('/transcricoes', transcricaoRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/favoritos', favoritoRoutes);
app.use('/categorias-nivel-acesso', categoriaNivelAcessoRoutes);
app.use('/config-nivel-acesso', configNivelAcessoRoutes);

app.listen(PORT, () => {
    console.log(`User Service rodando na porta ${PORT}`);
});
