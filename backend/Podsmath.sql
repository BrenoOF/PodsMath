-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema podsmath
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema podsmath
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `podsmath` DEFAULT CHARACTER SET utf8mb3 ;
USE `podsmath` ;

-- -----------------------------------------------------
-- Table `podsmath`.`imagens`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `podsmath`.`imagens` (
  `idimagens` INT NOT NULL AUTO_INCREMENT,
  `caminho_imagem` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`idimagens`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `podsmath`.`idiomas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `podsmath`.`idiomas` (
  `ididiomas` INT NOT NULL AUTO_INCREMENT,
  `nomeIdiomas` VARCHAR(45) NOT NULL,
  `imagens_idimagens` INT NULL DEFAULT NULL,
  PRIMARY KEY (`ididiomas`),
  INDEX `fk_idiomas_imagens` (`imagens_idimagens` ASC) VISIBLE,
  CONSTRAINT `fk_idiomas_imagens`
    FOREIGN KEY (`imagens_idimagens`)
    REFERENCES `podsmath`.`imagens` (`idimagens`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `podsmath`.`instituicoes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `podsmath`.`instituicoes` (
  `idinstituicoes` INT NOT NULL AUTO_INCREMENT,
  `imagens_idimagens` INT NULL DEFAULT NULL,
  `nome` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idinstituicoes`),
  INDEX `fk_instituicoes_imagens` (`imagens_idimagens` ASC) VISIBLE,
  CONSTRAINT `fk_instituicoes_imagens`
    FOREIGN KEY (`imagens_idimagens`)
    REFERENCES `podsmath`.`imagens` (`idimagens`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `podsmath`.`nivel_acesso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `podsmath`.`nivel_acesso` (
  `idnivel_acesso` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idnivel_acesso`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `podsmath`.`paletacor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `podsmath`.`paletacor` (
  `idpaletaCor` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `ativado` TINYINT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`idpaletaCor`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `podsmath`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `podsmath`.`usuarios` (
  `idusuarios` INT NOT NULL AUTO_INCREMENT,
  `instituicoes_idinstituicoes` INT,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(100) NOT NULL,
  `id_usuario_professor` INT NULL DEFAULT NULL,
  `nivel_acesso_idnivel_acesso` INT NOT NULL,
  `paletaCor_idpaletaCor` INT NOT NULL,
  `audiosEscutados` INT NULL DEFAULT '0',
  PRIMARY KEY (`idusuarios`),
  INDEX `fk_usuarios_instituicoes` (`instituicoes_idinstituicoes` ASC) VISIBLE,
  INDEX `fk_usuarios_professor` (`id_usuario_professor` ASC) VISIBLE,
  INDEX `fk_usuarios_nivel_acesso` (`nivel_acesso_idnivel_acesso` ASC) VISIBLE,
  INDEX `fk_usuarios_paletaCor` (`paletaCor_idpaletaCor` ASC) VISIBLE,
  CONSTRAINT `fk_usuarios_instituicoes`
    FOREIGN KEY (`instituicoes_idinstituicoes`)
    REFERENCES `podsmath`.`instituicoes` (`idinstituicoes`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_usuarios_nivel_acesso`
    FOREIGN KEY (`nivel_acesso_idnivel_acesso`)
    REFERENCES `podsmath`.`nivel_acesso` (`idnivel_acesso`),
  CONSTRAINT `fk_usuarios_paletaCor`
    FOREIGN KEY (`paletaCor_idpaletaCor`)
    REFERENCES `podsmath`.`paletacor` (`idpaletaCor`),
  CONSTRAINT `fk_usuarios_professor`
    FOREIGN KEY (`id_usuario_professor`)
    REFERENCES `podsmath`.`usuarios` (`idusuarios`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `podsmath`.`audios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `podsmath`.`audios` (
  `idaudios` INT NOT NULL AUTO_INCREMENT,
  `usuarios_idusuarios` INT NOT NULL,
  `imagens_idimagens` INT NULL DEFAULT NULL,
  `visualizacoes` INT NULL DEFAULT '0',
  `titulo` VARCHAR(255) NULL DEFAULT NULL,
  `descricao` TEXT NULL DEFAULT NULL,
  `idiomas_ididiomas` INT NOT NULL,
  `caminho_audio` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`idaudios`),
  INDEX `fk_audios_usuarios` (`usuarios_idusuarios` ASC) VISIBLE,
  INDEX `fk_audios_imagens` (`imagens_idimagens` ASC) VISIBLE,
  INDEX `fk_audios_idiomas` (`idiomas_ididiomas` ASC) VISIBLE,
  CONSTRAINT `fk_audios_idiomas`
    FOREIGN KEY (`idiomas_ididiomas`)
    REFERENCES `podsmath`.`idiomas` (`ididiomas`),
  CONSTRAINT `fk_audios_imagens`
    FOREIGN KEY (`imagens_idimagens`)
    REFERENCES `podsmath`.`imagens` (`idimagens`),
  CONSTRAINT `fk_audios_usuarios`
    FOREIGN KEY (`usuarios_idusuarios`)
    REFERENCES `podsmath`.`usuarios` (`idusuarios`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `podsmath`.`auditoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `podsmath`.`auditoria` (
  `idauditoria` INT NOT NULL AUTO_INCREMENT,
  `usuarios_idusuarios` INT NOT NULL,
  `mensagem` TEXT NULL DEFAULT NULL,
  `dataHora` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idauditoria`),
  INDEX `fk_auditoria_usuarios` (`usuarios_idusuarios` ASC) VISIBLE,
  CONSTRAINT `fk_auditoria_usuarios`
    FOREIGN KEY (`usuarios_idusuarios`)
    REFERENCES `podsmath`.`usuarios` (`idusuarios`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `podsmath`.`historico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `podsmath`.`historico` (
  `idhistorico` INT NOT NULL AUTO_INCREMENT,
  `usuarios_idusuarios` INT NOT NULL,
  `audios_idaudios` INT NOT NULL,
  `tempo_audio` TIME NULL DEFAULT NULL,
  PRIMARY KEY (`idhistorico`),
  INDEX `fk_historico_usuarios` (`usuarios_idusuarios` ASC) VISIBLE,
  INDEX `fk_historico_audios` (`audios_idaudios` ASC) VISIBLE,
  CONSTRAINT `fk_historico_audios`
    FOREIGN KEY (`audios_idaudios`)
    REFERENCES `podsmath`.`audios` (`idaudios`),
  CONSTRAINT `fk_historico_usuarios`
    FOREIGN KEY (`usuarios_idusuarios`)
    REFERENCES `podsmath`.`usuarios` (`idusuarios`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `podsmath`.`temas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `podsmath`.`temas` (
  `idtemas` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idtemas`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `podsmath`.`transcricao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `podsmath`.`transcricao` (
  `idTranscricao` INT NOT NULL AUTO_INCREMENT,
  `textoTranscricao` TEXT NOT NULL,
  `audios_idaudios` INT NOT NULL,
  `idiomas_ididiomas` INT NOT NULL,
  PRIMARY KEY (`idTranscricao`),
  INDEX `fk_transcricao_audios` (`audios_idaudios` ASC) VISIBLE,
  INDEX `fk_transcricao_idiomas` (`idiomas_ididiomas` ASC) VISIBLE,
  CONSTRAINT `fk_transcricao_audios`
    FOREIGN KEY (`audios_idaudios`)
    REFERENCES `podsmath`.`audios` (`idaudios`),
  CONSTRAINT `fk_transcricao_idiomas`
    FOREIGN KEY (`idiomas_ididiomas`)
    REFERENCES `podsmath`.`idiomas` (`ididiomas`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
