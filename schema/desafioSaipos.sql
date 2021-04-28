CREATE DATABASE IF NOT EXISTS `saipos_challenge` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `saipos_challenge`;

CREATE TABLE IF NOT EXISTS `tarefas` (
  `idtarefas` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) DEFAULT NULL,
  `descricao` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `status` int DEFAULT NULL,
  `n_concluido` int DEFAULT '0',
  PRIMARY KEY (`idtarefas`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8

