DROP DATABASE IF EXISTS patitas_perdidas_bd;

CREATE DATABASE patitas_perdidas_bd
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE patitas_perdidas_bd;

-- 1. Catálogos base
CREATE TABLE Especie (
    id_Esp SMALLINT NOT NULL AUTO_INCREMENT,
    especie VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_Esp)
) ENGINE=InnoDB;

CREATE TABLE Sexo (
    id_Sex SMALLINT NOT NULL AUTO_INCREMENT,
    sexo VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_Sex)
) ENGINE=InnoDB;

CREATE TABLE Estado_P (
    id_Ep SMALLINT NOT NULL AUTO_INCREMENT,
    est_Pu VARCHAR(30) NOT NULL,
    PRIMARY KEY (id_Ep)
) ENGINE=InnoDB;

CREATE TABLE Estado_Proceso (
    id_EP SMALLINT NOT NULL AUTO_INCREMENT,
    estado VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_EP)
) ENGINE=InnoDB;

CREATE TABLE Localidad (
    id_Loc SMALLINT NOT NULL AUTO_INCREMENT,
    loc VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_Loc)
) ENGINE=InnoDB;

CREATE TABLE Vacunas (
    id_VC SMALLINT(5) NOT NULL AUTO_INCREMENT,
    vacuna VARCHAR(10) NOT NULL,
    PRIMARY KEY (id_VC)
) ENGINE=InnoDB;

-- 2. Personas, roles/acceso y fundaciones
CREATE TABLE Cliente (
    id_cli SMALLINT NOT NULL AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    ape VARCHAR(50) NOT NULL,
    doc VARCHAR(20) NOT NULL,
    correo VARCHAR(100),
    tel VARCHAR(15),
    fec_na DATE,
    PRIMARY KEY (id_cli),
    UNIQUE KEY uq_cliente_doc (doc)
) ENGINE=InnoDB;

CREATE TABLE Director (
    id_di SMALLINT NOT NULL AUTO_INCREMENT,
    nom_Di VARCHAR(55) NOT NULL,
    ape_di VARCHAR(55) NOT NULL,
    doc VARCHAR(20) NOT NULL,
    tel VARCHAR(15),
    correo VARCHAR(100),
    fec_na DATE,
    PRIMARY KEY (id_di),
    UNIQUE KEY uq_director_doc (doc)
) ENGINE=InnoDB;

CREATE TABLE Fundacion (
    id_Fun SMALLINT NOT NULL AUTO_INCREMENT,
    id_Di SMALLINT,
    nit VARCHAR(20) NOT NULL,
    tel VARCHAR(15),
    correo VARCHAR(100),
    nom VARCHAR(60) NOT NULL,
    red_S VARCHAR(255),
    mision VARCHAR(255),
    vision VARCHAR(255),
    PRIMARY KEY (id_Fun),
    UNIQUE KEY uq_fundacion_nit (nit),
    CONSTRAINT fk_fundacion_director
    FOREIGN KEY (id_Di) REFERENCES Director(id_di)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;
