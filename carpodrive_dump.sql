-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: kodama.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `mensajes`
--

DROP TABLE IF EXISTS `mensajes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mensajes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reserva_id` int NOT NULL,
  `remitente_id` int NOT NULL,
  `mensaje` text NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `reserva_id` (`reserva_id`),
  KEY `remitente_id` (`remitente_id`),
  CONSTRAINT `mensajes_ibfk_1` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`),
  CONSTRAINT `mensajes_ibfk_2` FOREIGN KEY (`remitente_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mensajes`
--

LOCK TABLES `mensajes` WRITE;
/*!40000 ALTER TABLE `mensajes` DISABLE KEYS */;
INSERT INTO `mensajes` VALUES (1,1,1,'Holaa','2026-05-22 17:46:50'),(2,1,2,'Hola','2026-05-22 17:47:18'),(3,1,2,'hola','2026-05-22 17:49:45'),(4,2,2,'Hola','2026-05-22 18:03:12'),(5,1,1,'hola','2026-05-22 18:03:36'),(6,1,1,'hola','2026-05-22 18:05:15'),(7,1,1,'Hola','2026-05-22 18:05:24'),(8,1,1,'HOLA','2026-05-22 18:07:07'),(9,1,1,'hola','2026-05-22 18:08:53'),(10,1,1,'hey','2026-05-22 18:09:09'),(11,1,1,'d','2026-05-22 18:11:11'),(12,2,1,'si','2026-05-22 18:11:23'),(13,2,1,'s','2026-05-22 18:13:37'),(14,2,1,'ss','2026-05-22 18:13:50'),(15,2,1,'a','2026-05-22 18:14:33'),(16,1,2,'Que hubo ','2026-05-22 18:15:20'),(17,2,1,'a','2026-05-22 18:22:53'),(18,8,5,'AAA1','2026-05-23 04:37:14'),(19,10,14,'Hola perra ','2026-05-23 16:10:27');
/*!40000 ALTER TABLE `mensajes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `mensaje` text NOT NULL,
  `leida` tinyint DEFAULT '0',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
INSERT INTO `notificaciones` VALUES (1,10,'Yeisy Taliana Castillo reservó tu ruta Estación El Poblado → Universidad de Antioquia',1,'2026-05-22 18:35:01'),(2,17,'Yeisy Taliana Castillo reservó tu ruta Caldas → SENA Regional Antioquia',0,'2026-05-23 04:37:23'),(3,17,'Alexis rios reservó tu ruta Caldas → SENA Regional Antioquia',0,'2026-05-23 16:10:18');
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservas`
--

DROP TABLE IF EXISTS `reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ruta_id` int NOT NULL,
  `pasajero_id` int NOT NULL,
  `estado` enum('pendiente','confirmada','completada','cancelada') DEFAULT 'confirmada',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ruta_id` (`ruta_id`),
  KEY `pasajero_id` (`pasajero_id`),
  CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`ruta_id`) REFERENCES `rutas` (`id`),
  CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`pasajero_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
INSERT INTO `reservas` VALUES (1,2,2,'completada','2026-05-21 04:59:27'),(2,2,2,'completada','2026-05-21 04:59:27'),(3,4,5,'completada','2026-05-21 05:50:38'),(4,8,9,'confirmada','2026-05-21 23:31:41'),(5,13,11,'completada','2026-05-22 16:50:24'),(6,13,12,'completada','2026-05-22 16:55:32'),(7,13,9,'completada','2026-05-22 18:25:54'),(8,13,5,'completada','2026-05-22 18:35:01'),(9,14,5,'completada','2026-05-23 04:37:22'),(10,14,14,'confirmada','2026-05-23 16:10:18');
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutas`
--

DROP TABLE IF EXISTS `rutas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conductor_id` int NOT NULL,
  `tipo_origen` varchar(20) DEFAULT NULL,
  `origen` varchar(100) NOT NULL,
  `destino` varchar(100) NOT NULL,
  `hora_salida` time NOT NULL,
  `puestos_disponibles` int DEFAULT '4',
  `puestos_totales` int DEFAULT '4',
  `estado` enum('activa','completada','cancelada') DEFAULT 'activa',
  `fecha` date DEFAULT (curdate()),
  PRIMARY KEY (`id`),
  KEY `conductor_id` (`conductor_id`),
  CONSTRAINT `rutas_ibfk_1` FOREIGN KEY (`conductor_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutas`
--

LOCK TABLES `rutas` WRITE;
/*!40000 ALTER TABLE `rutas` DISABLE KEYS */;
INSERT INTO `rutas` VALUES (2,1,'comuna','Comuna 1 - Popular','Universidad EAFIT','06:00:00',2,4,'activa','2026-05-20'),(3,3,'metro','Estación Acevedo','Politécnico Colombiano Jaime Isaza Cadavid','12:00:00',4,4,'completada','2026-05-21'),(4,4,'comuna','Estación Ayurá','Institución Universitaria Pascual Bravo','14:00:00',3,4,'activa','2026-05-21'),(5,3,'','Politécnico Colombiano Jaime Isaza Cadavid','Estación Acevedo','20:00:00',4,4,'completada','2026-05-21'),(6,7,'','Estación Industriales','Universidad de Antioquia','10:10:00',4,4,'activa','2026-05-21'),(7,7,'','Universidad de Antioquia','Estación Industriales','16:00:00',4,4,'activa','2026-05-21'),(8,8,'','Estación Sabaneta','Instituto Tecnológico Metropolitano','08:00:00',3,4,'activa','2026-05-21'),(9,8,'','Instituto Tecnológico Metropolitano','Estación Sabaneta','14:00:00',4,4,'activa','2026-05-21'),(10,10,'','Estación La Estrella','Universidad de Antioquia','07:30:00',4,4,'completada','2026-05-21'),(11,10,'','Universidad de Antioquia','Estación Niquía','14:00:00',4,4,'completada','2026-05-21'),(12,10,'','Estación Niquía','Estación La Estrella','18:00:00',4,4,'completada','2026-05-21'),(13,10,'','Estación El Poblado','Universidad de Antioquia','12:00:00',0,4,'completada','2026-05-22'),(14,17,'','Caldas','SENA Regional Antioquia','14:00:00',2,4,'activa','2026-05-23');
/*!40000 ALTER TABLE `rutas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `perfil` enum('pasajero','conductor','admin') DEFAULT 'pasajero',
  `universidad` varchar(100) DEFAULT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo_conductor` enum('estudiante','docente') DEFAULT NULL,
  `puntos` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Carolina Rincon Vanegas','carolina23252@elpoli.edu.co','carolina17','conductor','politecnico','2026-05-21 02:59:24',NULL,0),(2,'Edison Rios','edison2020@eafit.edu.co','edison22','pasajero','eafit','2026-05-21 04:03:53',NULL,20),(3,'Paula Gil','paulis23251@elpoli.edu.co','paula21','conductor','politecnico','2026-05-21 05:31:20',NULL,0),(4,'Diana Zapata','dianalis@pasb.edu.co','diana','conductor','pascual','2026-05-21 05:42:39',NULL,0),(5,'Yeisy Taliana Castillo','yeisi123@pasb.edu.co','yeisi18','pasajero','pascual','2026-05-21 05:45:15',NULL,20),(6,'Manuela Alejandra Murillo','manuela_murillo@elpoli.edu.co','admin123','admin','politecnico','2026-05-21 20:58:49',NULL,0),(7,'Gabriel Diaz','Gabrielcacoo@udea.edu.co','gabriel18','conductor','Universidad de Antioquia','2026-05-21 22:39:27','estudiante',0),(8,'Gabriela Usma','gabrielausma@itm.edu.co','gabriela','conductor','Instituto Tecnológico Metropolitano','2026-05-21 23:28:36','docente',0),(9,'Susana Velez','susan@itm.edu.co','susana24','pasajero','Instituto Tecnológico Metropolitano','2026-05-21 23:31:12',NULL,0),(10,'Andres de Los Rios Ocoro','andrecitotubb@udea.edu.co','andres22','conductor','Universidad de Antioquia','2026-05-21 23:32:42','estudiante',0),(11,'Manuela ','manuela.murillo@udea.edu.co','manuela','pasajero','Universidad de Antioquia','2026-05-22 16:49:06',NULL,0),(12,'Carolina ','rinconvanegas@elpoli.edu.co','1234','pasajero','Politécnico Colombiano Jaime Isaza Cadavid','2026-05-22 16:49:08',NULL,10),(13,'Alexis Rios','alexis.rios@udea.edu.co','Alexos12345','pasajero','Universidad de Antioquia','2026-05-22 16:49:50',NULL,0),(14,'Alexis rios','alexisrios@udea.edu.co','Alexis123','pasajero','Universidad de Antioquia','2026-05-22 16:51:21',NULL,0),(15,'Julieta Vanegas soto','julietabbms@gmail.com','1025','conductor','Universidad Nacional de Colombia','2026-05-22 20:56:16','estudiante',0),(17,'Carolina  ','rincon@elpoli.edu.co','1234','conductor','Universidad Nacional de Colombia','2026-05-23 02:05:55','estudiante',0),(18,'Deisy García ','deisy26@itm.edu.co','deisy','conductor','Instituto Tecnológico Metropolitano','2026-05-23 02:14:55','docente',0);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehiculos`
--

DROP TABLE IF EXISTS `vehiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehiculos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conductor_id` int NOT NULL,
  `placa` varchar(20) NOT NULL,
  `marca` varchar(50) DEFAULT NULL,
  `modelo` varchar(50) DEFAULT NULL,
  `color` varchar(30) DEFAULT NULL,
  `puestos` int DEFAULT '4',
  PRIMARY KEY (`id`),
  UNIQUE KEY `placa` (`placa`),
  KEY `conductor_id` (`conductor_id`),
  CONSTRAINT `vehiculos_ibfk_1` FOREIGN KEY (`conductor_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehiculos`
--

LOCK TABLES `vehiculos` WRITE;
/*!40000 ALTER TABLE `vehiculos` DISABLE KEYS */;
INSERT INTO `vehiculos` VALUES (1,1,'ABC-234','Mazda','2021','Blanco',4),(2,3,'CVB-345','Chevrolet','2020','Rojo',4),(3,4,'AWW-123','Mercedes','2026','Blanco',4),(4,7,'ZXC-345','Mazda','CX30','Rojo',4),(6,10,'ABC-209','Toyota','Coroya','Blanco',4);
/*!40000 ALTER TABLE `vehiculos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-26 20:34:59
