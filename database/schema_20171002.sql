﻿--
-- Script was generated by Devart dbForge Studio for MySQL, Version 7.2.78.0
-- Product home page: http://www.devart.com/dbforge/mysql/studio
-- Script date 10/2/2017 2:17:23 AM
-- Server version: 5.7.14
-- Client version: 4.1
--


--
-- Definition for database notatsukinotanoshi
--
DROP DATABASE IF EXISTS notatsukinotanoshi;
CREATE DATABASE IF NOT EXISTS notatsukinotanoshi
	CHARACTER SET latin1
	COLLATE latin1_swedish_ci;

-- 
-- Disable foreign keys
-- 
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

-- 
-- Set SQL mode
-- 
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 
-- Set character set the client will use to send SQL statements to the server
--
SET NAMES 'utf8';

-- 
-- Set default database
--
USE notatsukinotanoshi;

--
-- Definition for table company_has_template
--
CREATE TABLE IF NOT EXISTS company_has_template (
  company_id INT(11) NOT NULL,
  template_id INT(11) NOT NULL,
  PRIMARY KEY (company_id, template_id),
  CONSTRAINT FK_company_to_info FOREIGN KEY (company_id)
    REFERENCES company_info(company_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT FK_template_to_email FOREIGN KEY (template_id)
    REFERENCES email_templates(template_id) ON DELETE CASCADE ON UPDATE NO ACTION
)
ENGINE = INNODB
CHARACTER SET latin1
COLLATE latin1_swedish_ci
ROW_FORMAT = DYNAMIC;

--
-- Definition for table company_info
--
CREATE TABLE IF NOT EXISTS company_info (
  company_id INT(11) NOT NULL AUTO_INCREMENT,
  code VARCHAR(30) NOT NULL,
  email VARCHAR(50) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_jp VARCHAR(255) DEFAULT NULL,
  name_zh VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (company_id),
  UNIQUE INDEX company_name (code),
  UNIQUE INDEX name_en (name_en)
)
ENGINE = INNODB
AUTO_INCREMENT = 2
AVG_ROW_LENGTH = 16384
CHARACTER SET latin1
COLLATE latin1_swedish_ci
ROW_FORMAT = DYNAMIC;

--
-- Definition for table email_templates
--
CREATE TABLE IF NOT EXISTS email_templates (
  template_id INT(11) NOT NULL AUTO_INCREMENT,
  text_body TEXT DEFAULT NULL,
  PRIMARY KEY (template_id)
)
ENGINE = INNODB
AUTO_INCREMENT = 1
CHARACTER SET latin1
COLLATE latin1_swedish_ci
ROW_FORMAT = DYNAMIC;

--
-- Definition for table submit_count
--
CREATE TABLE IF NOT EXISTS submit_count (
  submit_id INT(11) NOT NULL AUTO_INCREMENT,
  ip BIGINT(11) DEFAULT NULL,
  submit_time VARCHAR(255) DEFAULT NULL,
  company_id INT(11) DEFAULT NULL,
  PRIMARY KEY (submit_id),
  CONSTRAINT FK_submit_count_company_id FOREIGN KEY (company_id)
    REFERENCES company_info(company_id) ON DELETE CASCADE ON UPDATE CASCADE
)
ENGINE = INNODB
AUTO_INCREMENT = 8
AVG_ROW_LENGTH = 8192
CHARACTER SET latin1
COLLATE latin1_swedish_ci
ROW_FORMAT = DYNAMIC;

-- 
-- Restore previous SQL mode
-- 
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

-- 
-- Enable foreign keys
-- 
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;