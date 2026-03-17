-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: podsmath
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audios`
--

DROP TABLE IF EXISTS `audios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audios` (
  `idaudios` int NOT NULL AUTO_INCREMENT,
  `temas_idtemas` int NOT NULL,
  `usuarios_idusuarios` int NOT NULL,
  `imagens_idimagens` int NOT NULL,
  `visualizacoes` int DEFAULT '0',
  `titulo` text,
  `descricao` text,
  `idiomas_ididiomas` int NOT NULL,
  PRIMARY KEY (`idaudios`),
  KEY `fk_audios_temas1_idx` (`temas_idtemas`),
  KEY `fk_audios_usuarios1_idx` (`usuarios_idusuarios`),
  KEY `fk_audios_imagens1_idx` (`imagens_idimagens`),
  KEY `fk_audios_idiomas1_idx` (`idiomas_ididiomas`),
  CONSTRAINT `fk_audios_idiomas1` FOREIGN KEY (`idiomas_ididiomas`) REFERENCES `idiomas` (`ididiomas`),
  CONSTRAINT `fk_audios_imagens1` FOREIGN KEY (`imagens_idimagens`) REFERENCES `imagens` (`idimagens`),
  CONSTRAINT `fk_audios_temas1` FOREIGN KEY (`temas_idtemas`) REFERENCES `temas` (`idtemas`),
  CONSTRAINT `fk_audios_usuarios1` FOREIGN KEY (`usuarios_idusuarios`) REFERENCES `usuarios` (`idusuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audios`
--

LOCK TABLES `audios` WRITE;
/*!40000 ALTER TABLE `audios` DISABLE KEYS */;
/*!40000 ALTER TABLE `audios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditoria`
--

DROP TABLE IF EXISTS `auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria` (
  `idauditoria` int NOT NULL AUTO_INCREMENT,
  `usuarios_idusuarios` int NOT NULL,
  `mensagem` text,
  `dataHora` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idauditoria`),
  KEY `fk_auditoria_usuarios1_idx` (`usuarios_idusuarios`),
  CONSTRAINT `fk_auditoria_usuarios1` FOREIGN KEY (`usuarios_idusuarios`) REFERENCES `usuarios` (`idusuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria`
--

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
/*!40000 ALTER TABLE `auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria_nivel_acesso`
--

DROP TABLE IF EXISTS `categoria_nivel_acesso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria_nivel_acesso` (
  `idcategoria` int NOT NULL AUTO_INCREMENT,
  `nomecategoria` varchar(255) NOT NULL,
  `idnivel_acesso` int NOT NULL,
  PRIMARY KEY (`idcategoria`),
  KEY `idnivel_acesso` (`idnivel_acesso`),
  CONSTRAINT `categoria_nivel_acesso_ibfk_1` FOREIGN KEY (`idnivel_acesso`) REFERENCES `nivel_acesso` (`idnivel_acesso`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_nivel_acesso`
--

LOCK TABLES `categoria_nivel_acesso` WRITE;
/*!40000 ALTER TABLE `categoria_nivel_acesso` DISABLE KEYS */;
INSERT INTO `categoria_nivel_acesso` VALUES (1,'Usuario',1),(2,'Usuario',2),(3,'Usuario',3),(4,'Audio',1),(5,'Audio',2),(6,'Audio',3),(7,'Auditoria',1),(8,'Auditoria',2),(9,'Auditoria',3),(10,'Idioma',1),(11,'Idioma',2),(12,'Idioma',3),(13,'Imagem',1),(14,'Imagem',2),(15,'Imagem',3),(16,'Instituição',1),(17,'Instituição',2),(18,'Instituição',3),(19,'Nivel Acesso',1),(20,'Nivel Acesso',2),(21,'Nivel Acesso',3),(22,'Paleta Cor',1),(23,'Paleta Cor',2),(24,'Paleta Cor',3),(25,'Tema',1),(26,'Tema',2),(27,'Tema',3),(28,'Transcrição',1),(29,'Transcrição',2),(30,'Transcrição',3),(31,'Categoria',1),(32,'Categoria',2),(33,'Categoria',3),(34,'Configuração Acesso',1),(35,'Configuração Acesso',2),(36,'Configuração Acesso',3),(37,'Categoria Acesso',1),(38,'Categoria Acesso',2),(39,'Categoria Acesso',3);
/*!40000 ALTER TABLE `categoria_nivel_acesso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `idcategorias` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `imagens_idimagens` int DEFAULT NULL,
  PRIMARY KEY (`idcategorias`),
  KEY `fk_categorias_imagens1_idx` (`imagens_idimagens`),
  CONSTRAINT `fk_categorias_imagens1` FOREIGN KEY (`imagens_idimagens`) REFERENCES `imagens` (`idimagens`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Matemática Básica',NULL),(2,'Álgebra',NULL);
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `config_nivel_acesso`
--

DROP TABLE IF EXISTS `config_nivel_acesso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `config_nivel_acesso` (
  `idconfig` int NOT NULL AUTO_INCREMENT,
  `nomeconfig` varchar(255) NOT NULL,
  `idcategoria` int NOT NULL,
  PRIMARY KEY (`idconfig`),
  KEY `idcategoria` (`idcategoria`),
  CONSTRAINT `config_nivel_acesso_ibfk_1` FOREIGN KEY (`idcategoria`) REFERENCES `categoria_nivel_acesso` (`idcategoria`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `config_nivel_acesso`
--

LOCK TABLES `config_nivel_acesso` WRITE;
/*!40000 ALTER TABLE `config_nivel_acesso` DISABLE KEYS */;
INSERT INTO `config_nivel_acesso` VALUES (1,'Criar Usuarios',1),(2,'Editar Usuarios',1),(3,'Ver Usuarios',1),(4,'Excluir Usuarios',1),(5,'Criar Usuarios',2),(6,'Editar Usuarios',2),(7,'Ver Usuarios',2),(8,'Excluir Usuarios',2),(9,'Criar Usuarios',3),(10,'Editar Usuarios',3),(11,'Ver Usuarios',3),(12,'Excluir Usuarios',3),(13,'Criar Audios',4),(14,'Editar Audios',4),(15,'Excluir Audios',4),(16,'Criar Audios',5),(17,'Editar Audios',5),(18,'Excluir Audios',5),(19,'Criar Audios',6),(20,'Editar Audios',6),(21,'Excluir Audios',6),(22,'Ver Auditoria',7),(23,'Ver Auditoria',8),(24,'Ver Auditoria',9),(25,'Criar Idiomas',10),(26,'Editar Idiomas',10),(27,'Excluir Idiomas',10),(28,'Criar Idiomas',11),(29,'Editar Idiomas',11),(30,'Excluir Idiomas',11),(31,'Criar Idiomas',12),(32,'Editar Idiomas',12),(33,'Excluir Idiomas',12),(34,'Importar Imagens',13),(35,'Excluir Imagens',13),(36,'Importar Imagens',14),(37,'Excluir Imagens',14),(38,'Importar Imagens',15),(39,'Excluir Imagens',15),(40,'Criar Instituições',16),(41,'Editar Instituições',16),(42,'Excluir Instituições',16),(43,'Criar Instituições',17),(44,'Editar Instituições',17),(45,'Excluir Instituições',17),(46,'Criar Instituições',18),(47,'Editar Instituições',18),(48,'Excluir Instituições',18),(49,'Criar Nivel de Acesso',19),(50,'Editar Nivel de Acesso',19),(51,'Ver Nivel de Acesso',19),(52,'Excluir Nivel de Acesso',19),(53,'Criar Nivel de Acesso',20),(54,'Editar Nivel de Acesso',20),(55,'Ver Nivel de Acesso',20),(56,'Excluir Nivel de Acesso',20),(57,'Criar Nivel de Acesso',21),(58,'Editar Nivel de Acesso',21),(59,'Ver Nivel de Acesso',21),(60,'Excluir Nivel de Acesso',21),(61,'Criar Paleta Cor',22),(62,'Editar Paleta Cor',22),(63,'Excluir Paleta Cor',22),(64,'Criar Paleta Cor',23),(65,'Editar Paleta Cor',23),(66,'Excluir Paleta Cor',23),(67,'Criar Paleta Cor',24),(68,'Editar Paleta Cor',24),(69,'Excluir Paleta Cor',24),(70,'Criar Tema',25),(71,'Editar Tema',25),(72,'Excluir Tema',25),(73,'Criar Tema',26),(74,'Editar Tema',26),(75,'Excluir Tema',26),(76,'Criar Tema',27),(77,'Editar Tema',27),(78,'Excluir Tema',27),(79,'Editar Transcrição',28),(80,'Editar Transcrição',29),(81,'Editar Transcrição',30),(82,'Criar Categoria',31),(83,'Editar Categoria',31),(84,'Excluir Categoria',31),(85,'Criar Categoria',32),(86,'Editar Categoria',32),(87,'Excluir Categoria',32),(88,'Criar Categoria',33),(89,'Editar Categoria',33),(90,'Excluir Categoria',33),(91,'Criar Configuração',34),(92,'Editar Configuração',34),(93,'Excluir Configuração',34),(94,'Criar Configuração',35),(95,'Editar Configuração',35),(96,'Excluir Configuração',35),(97,'Criar Configuração',36),(98,'Editar Configuração',36),(99,'Excluir Configuração',36),(100,'Criar Categoria Acesso',37),(101,'Editar Categoria Acesso',37),(102,'Excluir Categoria Acesso',37),(103,'Criar Categoria Acesso',38),(104,'Editar Categoria Acesso',38),(105,'Excluir Categoria Acesso',38),(106,'Criar Categoria Acesso',39),(107,'Editar Categoria Acesso',39),(108,'Excluir Categoria Acesso',39);
/*!40000 ALTER TABLE `config_nivel_acesso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `usuarios_idusuarios` int NOT NULL,
  `audios_idaudios` int NOT NULL,
  `dataAdicionado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuarios_idusuarios`,`audios_idaudios`),
  KEY `fk_favoritos_audios1_idx` (`audios_idaudios`),
  CONSTRAINT `fk_favoritos_audios1` FOREIGN KEY (`audios_idaudios`) REFERENCES `audios` (`idaudios`) ON DELETE CASCADE,
  CONSTRAINT `fk_favoritos_usuarios1` FOREIGN KEY (`usuarios_idusuarios`) REFERENCES `usuarios` (`idusuarios`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historico`
--

DROP TABLE IF EXISTS `historico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico` (
  `idhistorico` int NOT NULL AUTO_INCREMENT,
  `usuarios_idusuarios` int NOT NULL,
  `audios_idaudios` int NOT NULL,
  `tempo_audio` time DEFAULT NULL,
  PRIMARY KEY (`idhistorico`),
  KEY `fk_historico_usuarios1_idx` (`usuarios_idusuarios`),
  KEY `fk_historico_audios1_idx` (`audios_idaudios`),
  CONSTRAINT `fk_historico_audios1` FOREIGN KEY (`audios_idaudios`) REFERENCES `audios` (`idaudios`),
  CONSTRAINT `fk_historico_usuarios1` FOREIGN KEY (`usuarios_idusuarios`) REFERENCES `usuarios` (`idusuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historico`
--

LOCK TABLES `historico` WRITE;
/*!40000 ALTER TABLE `historico` DISABLE KEYS */;
/*!40000 ALTER TABLE `historico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `idiomas`
--

DROP TABLE IF EXISTS `idiomas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `idiomas` (
  `ididiomas` int NOT NULL AUTO_INCREMENT,
  `nomeIdiomas` varchar(45) NOT NULL,
  PRIMARY KEY (`ididiomas`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `idiomas`
--

LOCK TABLES `idiomas` WRITE;
/*!40000 ALTER TABLE `idiomas` DISABLE KEYS */;
INSERT INTO `idiomas` VALUES (1,'Português'),(2,'English'),(3,'Spanish');
/*!40000 ALTER TABLE `idiomas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagens`
--

DROP TABLE IF EXISTS `imagens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagens` (
  `idimagens` int NOT NULL AUTO_INCREMENT,
  `caminho_imagem` varchar(200) NOT NULL,
  PRIMARY KEY (`idimagens`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagens`
--

LOCK TABLES `imagens` WRITE;
/*!40000 ALTER TABLE `imagens` DISABLE KEYS */;
/*!40000 ALTER TABLE `imagens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instituicoes`
--

DROP TABLE IF EXISTS `instituicoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instituicoes` (
  `idinstituicoes` int NOT NULL AUTO_INCREMENT,
  `imagens_idimagens` int DEFAULT NULL,
  `nome` varchar(45) NOT NULL,
  PRIMARY KEY (`idinstituicoes`),
  KEY `fk_instituicoes_imagens1_idx` (`imagens_idimagens`),
  CONSTRAINT `fk_instituicoes_imagens1` FOREIGN KEY (`imagens_idimagens`) REFERENCES `imagens` (`idimagens`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instituicoes`
--

LOCK TABLES `instituicoes` WRITE;
/*!40000 ALTER TABLE `instituicoes` DISABLE KEYS */;
INSERT INTO `instituicoes` VALUES (1,NULL,'Fatec Lins');
/*!40000 ALTER TABLE `instituicoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nivel_acesso`
--

DROP TABLE IF EXISTS `nivel_acesso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nivel_acesso` (
  `idnivel_acesso` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `ativado` varchar(45) NOT NULL,
  PRIMARY KEY (`idnivel_acesso`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nivel_acesso`
--

LOCK TABLES `nivel_acesso` WRITE;
/*!40000 ALTER TABLE `nivel_acesso` DISABLE KEYS */;
INSERT INTO `nivel_acesso` VALUES (1,'Administrador',''),(2,'Professor',''),(3,'Aluno','');
/*!40000 ALTER TABLE `nivel_acesso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paletacor`
--

DROP TABLE IF EXISTS `paletacor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paletacor` (
  `idpaletaCor` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `app-background` varchar(45) DEFAULT NULL,
  `border-color-tema` varchar(45) DEFAULT NULL,
  `border-inversa` varchar(45) DEFAULT NULL,
  `font-paragrafo` varchar(45) DEFAULT NULL,
  `font-meio-apagada` varchar(45) DEFAULT NULL,
  `sobre-projeto-bg` varchar(45) DEFAULT NULL,
  `btn-1` varchar(45) DEFAULT NULL,
  `btn-1-hover` varchar(45) DEFAULT NULL,
  `ativado` binary(1) NOT NULL,
  PRIMARY KEY (`idpaletaCor`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paletacor`
--

LOCK TABLES `paletacor` WRITE;
/*!40000 ALTER TABLE `paletacor` DISABLE KEYS */;
INSERT INTO `paletacor` VALUES (1,'Claro Padrão','#ffffff','#e2e8f0','#26344a','#4577A1','#64748b','#4577A124','#012663','#1a3f8f',_binary ''),(2,'Escuro Padrão','#0f131a','#26344a','#e2e8f0','#ffffff','#94a3b8','#17255433','#ff5724','#ff5724e6',_binary '');
/*!40000 ALTER TABLE `paletacor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `temas`
--

DROP TABLE IF EXISTS `temas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `temas` (
  `idtemas` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(45) NOT NULL,
  `categorias_idcategorias` int NOT NULL,
  `imagens_idimagens` int DEFAULT NULL,
  PRIMARY KEY (`idtemas`),
  KEY `fk_temas_categorias1_idx` (`categorias_idcategorias`),
  KEY `fk_temas_imagens1_idx` (`imagens_idimagens`),
  CONSTRAINT `fk_temas_categorias1` FOREIGN KEY (`categorias_idcategorias`) REFERENCES `categorias` (`idcategorias`),
  CONSTRAINT `fk_temas_imagens1` FOREIGN KEY (`imagens_idimagens`) REFERENCES `imagens` (`idimagens`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temas`
--

LOCK TABLES `temas` WRITE;
/*!40000 ALTER TABLE `temas` DISABLE KEYS */;
INSERT INTO `temas` VALUES (1,'Equações de Primeiro Grau',1,NULL),(2,'Funções',2,NULL);
/*!40000 ALTER TABLE `temas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transcricao`
--

DROP TABLE IF EXISTS `transcricao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transcricao` (
  `idTranscricao` int NOT NULL AUTO_INCREMENT,
  `textoTranscricao` mediumtext NOT NULL,
  `audios_idaudios` int NOT NULL,
  `idiomas_ididiomas` int NOT NULL,
  PRIMARY KEY (`idTranscricao`),
  KEY `fk_Transcricao_audios1_idx` (`audios_idaudios`),
  KEY `fk_transcricao_idiomas1_idx` (`idiomas_ididiomas`),
  CONSTRAINT `fk_Transcricao_audios1` FOREIGN KEY (`audios_idaudios`) REFERENCES `audios` (`idaudios`),
  CONSTRAINT `fk_transcricao_idiomas1` FOREIGN KEY (`idiomas_ididiomas`) REFERENCES `idiomas` (`ididiomas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transcricao`
--

LOCK TABLES `transcricao` WRITE;
/*!40000 ALTER TABLE `transcricao` DISABLE KEYS */;
/*!40000 ALTER TABLE `transcricao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `idusuarios` int NOT NULL AUTO_INCREMENT,
  `instituicoes_idinstituicoes` int DEFAULT NULL,
  `nome` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `senha` varchar(60) NOT NULL,
  `id_usuario_professor` int DEFAULT NULL,
  `nivel_acesso_idnivel_acesso` int NOT NULL,
  `paletaCor_idpaletaCor` int NOT NULL,
  `audiosEscutados` int NOT NULL DEFAULT '0',
  `imagens_idimagens` int DEFAULT NULL,
  PRIMARY KEY (`idusuarios`),
  KEY `fk_usuarios_instituicoes1_idx` (`instituicoes_idinstituicoes`),
  KEY `fk_usuarios_usuarios1_idx` (`id_usuario_professor`),
  KEY `fk_usuarios_nivel_acesso1_idx` (`nivel_acesso_idnivel_acesso`),
  KEY `fk_usuarios_paletaCor1_idx` (`paletaCor_idpaletaCor`),
  KEY `fk_usuarios_imagens1_idx` (`imagens_idimagens`),
  CONSTRAINT `fk_usuarios_imagens1` FOREIGN KEY (`imagens_idimagens`) REFERENCES `imagens` (`idimagens`),
  CONSTRAINT `fk_usuarios_instituicoes1` FOREIGN KEY (`instituicoes_idinstituicoes`) REFERENCES `instituicoes` (`idinstituicoes`),
  CONSTRAINT `fk_usuarios_nivel_acesso1` FOREIGN KEY (`nivel_acesso_idnivel_acesso`) REFERENCES `nivel_acesso` (`idnivel_acesso`),
  CONSTRAINT `fk_usuarios_paletaCor1` FOREIGN KEY (`paletaCor_idpaletaCor`) REFERENCES `paletacor` (`idpaletaCor`),
  CONSTRAINT `fk_usuarios_usuarios1` FOREIGN KEY (`id_usuario_professor`) REFERENCES `usuarios` (`idusuarios`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,NULL,'Breno Oliveira Fidelis','fobreno@gmail.com','$2b$10$pITP0PLZejJdw7QHqG6Ur.EMDh8OdvEKBA6ZwxQi/QrR1.5lMj1hC',NULL,1,2,0,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-16 23:47:16
