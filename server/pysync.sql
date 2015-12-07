# ************************************************************
# Sequel Pro SQL dump
# Version 4499
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.9)
# Database: pysync
# Generation Time: 2015-12-07 14:27:26 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table clients
# ------------------------------------------------------------

DROP TABLE IF EXISTS `clients`;

CREATE TABLE `clients` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `key_id` int(11) DEFAULT NULL COMMENT 'the id of the s_key/m_key of the share that this file belongs ',
  `baseurl` varchar(1024) DEFAULT '' COMMENT 'the root url where the files of this share can be downloaded',
  `is_master` tinyint(1) DEFAULT '0' COMMENT 'is this client master of this share ? 1 yes, 0 no',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table files
# ------------------------------------------------------------

DROP TABLE IF EXISTS `files`;

CREATE TABLE `files` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `key_id` int(11) NOT NULL COMMENT 'the id of the s_key/m_key of the share that this file belongs ',
  `client_id` int(11) DEFAULT NULL COMMENT 'the client_id of the client ho put_list this file',
  `path` varchar(1024) DEFAULT '' COMMENT 'the relative path from the folder root',
  `size` int(11) DEFAULT NULL COMMENT 'the size of the file in byte',
  `mtime` datetime DEFAULT NULL COMMENT 'last modification time of the file on the master filesystem',
  `ptime` datetime DEFAULT NULL COMMENT 'last time that line was pushed to the server',
  `md5` varchar(32) DEFAULT NULL COMMENT 'md5 sum of the file content',
  PRIMARY KEY (`id`),
  KEY `key_id` (`key_id`),
  KEY `path` (`path`),
  KEY `ptime` (`ptime`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table keys
# ------------------------------------------------------------

DROP TABLE IF EXISTS `keys`;

CREATE TABLE `keys` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `s_key` varchar(255) NOT NULL DEFAULT '' COMMENT 'the slave (read-only) key, mandatory',
  `m_key` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
