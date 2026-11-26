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

CREATE TABLE Director_Fundacion (
    Directorid_Di SMALLINT NOT NULL,
    Fundacionid_Fun SMALLINT NOT NULL,
    PRIMARY KEY (Directorid_Di, Fundacionid_Fun),
    CONSTRAINT fk_df_director
      FOREIGN KEY (Directorid_Di) REFERENCES Director(id_di)
      ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_df_fundacion
      FOREIGN KEY (Fundacionid_Fun) REFERENCES Fundacion(id_Fun)
      ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Ubicaciones y sedes
CREATE TABLE Barrio (
    id_Ba SMALLINT NOT NULL AUTO_INCREMENT,
    barrio VARCHAR(60) NOT NULL,
    id_Loc SMALLINT NOT NULL,
    PRIMARY KEY (id_Ba),
    CONSTRAINT fk_barrio_localidad
      FOREIGN KEY (id_Loc) REFERENCES Localidad(id_Loc)
      ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE Sede (
    id_Sed SMALLINT NOT NULL AUTO_INCREMENT,
    id_Fun SMALLINT NOT NULL,
    id_Ba SMALLINT NOT NULL,
    nom_Se VARCHAR(60) NOT NULL,
    tel VARCHAR(15),
    PRIMARY KEY (id_Sed),
    CONSTRAINT fk_sede_fundacion
      FOREIGN KEY (id_Fun) REFERENCES Fundacion(id_Fun)
      ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_sede_barrio
      FOREIGN KEY (id_Ba) REFERENCES Barrio(id_Ba)
      ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;