CREATE DATABASE  IF NOT EXISTS `podsmath` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `podsmath`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: podsmath
-- ------------------------------------------------------
-- Server version	8.0.41

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
  `imagens_idimagens` int DEFAULT NULL,
  `visualizacoes` int DEFAULT '0',
  `titulo` varchar(255) DEFAULT NULL,
  `descricao` text,
  `idiomas_ididiomas` int NOT NULL,
  PRIMARY KEY (`idaudios`),
  KEY `fk_audios_temas` (`temas_idtemas`),
  KEY `fk_audios_usuarios` (`usuarios_idusuarios`),
  KEY `fk_audios_imagens` (`imagens_idimagens`),
  KEY `fk_audios_idiomas` (`idiomas_ididiomas`),
  CONSTRAINT `fk_audios_idiomas` FOREIGN KEY (`idiomas_ididiomas`) REFERENCES `idiomas` (`ididiomas`),
  CONSTRAINT `fk_audios_imagens` FOREIGN KEY (`imagens_idimagens`) REFERENCES `imagens` (`idimagens`),
  CONSTRAINT `fk_audios_temas` FOREIGN KEY (`temas_idtemas`) REFERENCES `temas` (`idtemas`),
  CONSTRAINT `fk_audios_usuarios` FOREIGN KEY (`usuarios_idusuarios`) REFERENCES `usuarios` (`idusuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `dataHora` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idauditoria`),
  KEY `fk_auditoria_usuarios` (`usuarios_idusuarios`),
  CONSTRAINT `fk_auditoria_usuarios` FOREIGN KEY (`usuarios_idusuarios`) REFERENCES `usuarios` (`idusuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  KEY `fk_historico_usuarios` (`usuarios_idusuarios`),
  KEY `fk_historico_audios` (`audios_idaudios`),
  CONSTRAINT `fk_historico_audios` FOREIGN KEY (`audios_idaudios`) REFERENCES `audios` (`idaudios`),
  CONSTRAINT `fk_historico_usuarios` FOREIGN KEY (`usuarios_idusuarios`) REFERENCES `usuarios` (`idusuarios`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `idiomas`
--

DROP TABLE IF EXISTS `idiomas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `idiomas` (
  `ididiomas` int NOT NULL AUTO_INCREMENT,
  `nomeIdiomas` varchar(45) NOT NULL,
  `imagens_idimagens` int DEFAULT NULL,
  PRIMARY KEY (`ididiomas`),
  KEY `fk_idiomas_imagens` (`imagens_idimagens`),
  CONSTRAINT `fk_idiomas_imagens` FOREIGN KEY (`imagens_idimagens`) REFERENCES `imagens` (`idimagens`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `imagens`
--

DROP TABLE IF EXISTS `imagens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagens` (
  `idimagens` int NOT NULL AUTO_INCREMENT,
  `caminho_imagem` varchar(255) NOT NULL,
  PRIMARY KEY (`idimagens`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `instituicoes`
--

DROP TABLE IF EXISTS `instituicoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instituicoes` (
  `idinstituicoes` int NOT NULL AUTO_INCREMENT,
  `imagens_idimagens` int DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idinstituicoes`),
  KEY `fk_instituicoes_imagens` (`imagens_idimagens`),
  CONSTRAINT `fk_instituicoes_imagens` FOREIGN KEY (`imagens_idimagens`) REFERENCES `imagens` (`idimagens`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `nivel_acesso`
--

DROP TABLE IF EXISTS `nivel_acesso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nivel_acesso` (
  `idnivel_acesso` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idnivel_acesso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `paletacor`
--

DROP TABLE IF EXISTS `paletacor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paletacor` (
  `idpaletaCor` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `ativado` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idpaletaCor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `temas`
--

DROP TABLE IF EXISTS `temas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `temas` (
  `idtemas` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  PRIMARY KEY (`idtemas`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transcricao`
--

DROP TABLE IF EXISTS `transcricao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transcricao` (
  `idTranscricao` int NOT NULL AUTO_INCREMENT,
  `textoTranscricao` text NOT NULL,
  `audios_idaudios` int NOT NULL,
  `idiomas_ididiomas` int NOT NULL,
  PRIMARY KEY (`idTranscricao`),
  KEY `fk_transcricao_audios` (`audios_idaudios`),
  KEY `fk_transcricao_idiomas` (`idiomas_ididiomas`),
  CONSTRAINT `fk_transcricao_audios` FOREIGN KEY (`audios_idaudios`) REFERENCES `audios` (`idaudios`),
  CONSTRAINT `fk_transcricao_idiomas` FOREIGN KEY (`idiomas_ididiomas`) REFERENCES `idiomas` (`ididiomas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `idusuarios` int NOT NULL AUTO_INCREMENT,
  `instituicoes_idinstituicoes` int DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `senha` varchar(100) DEFAULT NULL,
  `id_usuario_professor` int DEFAULT NULL,
  `nivel_acesso_idnivel_acesso` int NOT NULL,
  `paletaCor_idpaletaCor` int NOT NULL,
  `audiosEscutados` int DEFAULT '0',
  PRIMARY KEY (`idusuarios`),
  KEY `fk_usuarios_instituicoes` (`instituicoes_idinstituicoes`),
  KEY `fk_usuarios_professor` (`id_usuario_professor`),
  KEY `fk_usuarios_nivel_acesso` (`nivel_acesso_idnivel_acesso`),
  KEY `fk_usuarios_paletaCor` (`paletaCor_idpaletaCor`),
  CONSTRAINT `fk_usuarios_instituicoes` FOREIGN KEY (`instituicoes_idinstituicoes`) REFERENCES `instituicoes` (`idinstituicoes`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_usuarios_nivel_acesso` FOREIGN KEY (`nivel_acesso_idnivel_acesso`) REFERENCES `nivel_acesso` (`idnivel_acesso`),
  CONSTRAINT `fk_usuarios_paletaCor` FOREIGN KEY (`paletaCor_idpaletaCor`) REFERENCES `paletacor` (`idpaletaCor`),
  CONSTRAINT `fk_usuarios_professor` FOREIGN KEY (`id_usuario_professor`) REFERENCES `usuarios` (`idusuarios`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'podsmath'
--

--
-- Dumping routines for database 'podsmath'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-11 10:06:43
