/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.15-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: LibraryDB
-- ------------------------------------------------------
-- Server version	10.11.15-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `Book`
--

LOCK TABLES `Book` WRITE;
/*!40000 ALTER TABLE `Book` DISABLE KEYS */;
INSERT INTO `Book` VALUES
('978-0131873254','Artificial Intelligence: A Modern Approach','Stuart Russell, Peter Norvig',6000.00,'English',30),
('978-0132350884','Clean Code','Robert C. Martin',3500.00,'English',25),
('978-0133969290','University Physics','Hugh Young, Roger Freedman',5800.00,'English',42),
('978-0134167237','Principles of Economics','N. Gregory Mankiw',3900.00,'English',22),
('978-0134685991','Effective Java','Joshua Bloch',2800.00,'English',15),
('978-0141036137','1984','George Orwell',450.00,'English',12),
('978-0262033848','Introduction to Algorithms','Cormen, Leiserson, Rivest, Stein',5200.00,'English',40),
('978-0321125217','The Pragmatic Programmer','Andrew Hunt, David Thomas',3200.00,'English',18),
('978-0451524935','100 Years of Solitude','Gabriel García Márquez',600.00,'Spanish',8),
('978-0470458365','Calculus: Early Transcendentals','James Stewart',4500.00,'English',55),
('978-0743273565','The Great Gatsby','F. Scott Fitzgerald',380.00,'English',5);
/*!40000 ALTER TABLE `Book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Book_Categories`
--

LOCK TABLES `Book_Categories` WRITE;
/*!40000 ALTER TABLE `Book_Categories` DISABLE KEYS */;
INSERT INTO `Book_Categories` VALUES
('978-0132350884','Class','Educational'),
('978-0132350884','Field','Computer Science'),
('978-0132350884','Sub-Field','Software Engineering'),
('978-0133969290','Class','Educational'),
('978-0133969290','Field','Physics'),
('978-0134167237','Class','Educational'),
('978-0134167237','Field','Economics'),
('978-0141036137','Format','Paperback'),
('978-0141036137','Genre','Dystopian'),
('978-0262033848','Class','Educational'),
('978-0262033848','Field','Computer Science'),
('978-0262033848','Sub-Field','Algorithms'),
('978-0470458365','Class','Educational'),
('978-0470458365','Field','Mathematics'),
('978-0470458365','Level','Undergraduate'),
('978-0743273565','Genre','Classic Literature');
/*!40000 ALTER TABLE `Book_Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Book_Tags`
--

LOCK TABLES `Book_Tags` WRITE;
/*!40000 ALTER TABLE `Book_Tags` DISABLE KEYS */;
INSERT INTO `Book_Tags` VALUES
('978-0132350884','Best Practices'),
('978-0132350884','Programming'),
('978-0133969290','Science'),
('978-0134167237','Finance'),
('978-0141036137','Philosophy'),
('978-0141036137','Politics'),
('978-0262033848','Data Structures'),
('978-0262033848','Logic'),
('978-0451524935','Magical Realism'),
('978-0470458365','Math'),
('978-0470458365','STEM');
/*!40000 ALTER TABLE `Book_Tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Copy`
--

LOCK TABLES `Copy` WRITE;
/*!40000 ALTER TABLE `Copy` DISABLE KEYS */;
INSERT INTO `Copy` VALUES
('978-0141036137','BC-001','Available','New','2025-01-20'),
('978-0141036137','BC-002','Loaned','Fair','2025-01-20'),
('978-0743273565','BC-003','Available','New','2025-02-15'),
('978-0262033848','CS-AL-001','Loaned','Fair','2024-12-05'),
('978-0262033848','CS-AL-002','Available','New','2024-12-05'),
('978-0132350884','CS-CC-001','Available','New','2025-01-10'),
('978-0132350884','CS-CC-002','Available','Good','2025-01-10'),
('978-0134167237','EC-PE-001','Loaned','New','2025-03-01'),
('978-0470458365','MA-CA-001','Available','New','2025-02-20'),
('978-0133969290','PH-UP-001','Available','Good','2025-01-15');
/*!40000 ALTER TABLE `Copy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Loans`
--

LOCK TABLES `Loans` WRITE;
/*!40000 ALTER TABLE `Loans` DISABLE KEYS */;
/*!40000 ALTER TABLE `Loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Membership_Tiers`
--

LOCK TABLES `Membership_Tiers` WRITE;
/*!40000 ALTER TABLE `Membership_Tiers` DISABLE KEYS */;
INSERT INTO `Membership_Tiers` VALUES
('Advanced',5,3),
('Premium',10,10),
('Standard',3,1);
/*!40000 ALTER TABLE `Membership_Tiers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Reservations`
--

LOCK TABLES `Reservations` WRITE;
/*!40000 ALTER TABLE `Reservations` DISABLE KEYS */;
/*!40000 ALTER TABLE `Reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Review`
--

LOCK TABLES `Review` WRITE;
/*!40000 ALTER TABLE `Review` DISABLE KEYS */;
/*!40000 ALTER TABLE `Review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES
(1,'TestUser','passtest',0,'546321','Checking Address, Dhaka','2026-04-26',0.00,NULL),
(2,'Anas','otherpass',0,'467832','Khilgaon, Dhaka','2026-04-27',0.00,'Standard');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-27  6:07:50
