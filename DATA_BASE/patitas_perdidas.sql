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


-- 4. Razas
CREATE TABLE Raza (
    id_RZ SMALLINT NOT NULL AUTO_INCREMENT,
    raza VARCHAR(100) NOT NULL,
    id_Esp SMALLINT NOT NULL,
    raza_indefinida VARCHAR(100) NULL DEFAULT NULL,
    PRIMARY KEY (id_RZ),
    CONSTRAINT fk_raza_especie
      FOREIGN KEY (id_Esp) REFERENCES Especie(id_Esp)
      ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 5. Mascotas perdidas/encontradas y mascotas en adopción
CREATE TABLE Mac_PR (
    id_MP SMALLINT NOT NULL AUTO_INCREMENT,
    id_Cli SMALLINT NOT NULL,
    id_Sex SMALLINT NOT NULL,
    id_RZ SMALLINT NOT NULL,
    id_Ep SMALLINT NOT NULL,
    id_Ba SMALLINT NOT NULL,
    m_Nom VARCHAR(50),
    foto VARBINARY(2000),
    edad DATE,
    direc VARCHAR(100),
    fh_p TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    descri VARCHAR(255),
    PRIMARY KEY (id_MP),
    CONSTRAINT fk_macpr_cliente FOREIGN KEY (id_Cli) REFERENCES Cliente(id_cli),
    CONSTRAINT fk_macpr_sexo FOREIGN KEY (id_Sex) REFERENCES Sexo(id_Sex),
    CONSTRAINT fk_macpr_raza FOREIGN KEY (id_RZ) REFERENCES Raza(id_RZ),
    CONSTRAINT fk_macpr_estado FOREIGN KEY (id_Ep) REFERENCES Estado_P(id_Ep),
    CONSTRAINT fk_macpr_barrio FOREIGN KEY (id_Ba) REFERENCES Barrio(id_Ba)
) ENGINE=InnoDB;

CREATE TABLE Mac_AD (
    id_Adp SMALLINT NOT NULL AUTO_INCREMENT,
    id_Sed SMALLINT NOT NULL,
    id_Sex SMALLINT NOT NULL,
    id_Rz SMALLINT NOT NULL,
    id_EP SMALLINT NOT NULL,
    m_Nom VARCHAR(50) NOT NULL,
    edad DATE,
    foto VARBINARY(2000),
    fh_P_A TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    fh_A_T TIMESTAMP NULL DEFAULT NULL,
    descri VARCHAR(255),
    esteril SMALLINT DEFAULT 0,
    dpara SMALLINT DEFAULT 0,
    PRIMARY KEY (id_Adp),
    CONSTRAINT fk_macad_sede FOREIGN KEY (id_Sed) REFERENCES Sede(id_Sed),
    CONSTRAINT fk_macad_sexo FOREIGN KEY (id_Sex) REFERENCES Sexo(id_Sex),
    CONSTRAINT fk_macad_raza FOREIGN KEY (id_Rz) REFERENCES Raza(id_RZ),
    CONSTRAINT fk_macad_estado FOREIGN KEY (id_EP) REFERENCES Estado_P(id_Ep)
) ENGINE=InnoDB;

CREATE TABLE Mac_AD_Vacunas (
    Mac_ADid_Adp SMALLINT NOT NULL,
    Vacunasid_VC SMALLINT(5) NOT NULL,
    PRIMARY KEY (Mac_ADid_Adp, Vacunasid_VC),
    CONSTRAINT fk_madv_macad FOREIGN KEY (Mac_ADid_Adp) REFERENCES Mac_AD(id_Adp) ON DELETE CASCADE,
    CONSTRAINT fk_madv_vacuna FOREIGN KEY (Vacunasid_VC) REFERENCES Vacunas(id_VC) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Adopciones, reportes, eventos y donaciones
CREATE TABLE Proc_Adp (
    id_PA SMALLINT NOT NULL AUTO_INCREMENT,
    id_CL SMALLINT NOT NULL,
    id_Adp SMALLINT NOT NULL,
    id_EP SMALLINT NOT NULL,
    direc VARCHAR(100),
    fh_I TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    fh_F TIMESTAMP NULL DEFAULT NULL,
    observacion VARCHAR(45) NULL DEFAULT NULL,
    condicion VARCHAR(45) NULL DEFAULT NULL,
    PRIMARY KEY (id_PA),
    CONSTRAINT fk_proc_cliente FOREIGN KEY (id_CL) REFERENCES Cliente(id_cli),
    CONSTRAINT fk_proc_macad FOREIGN KEY (id_Adp) REFERENCES Mac_AD(id_Adp),
    CONSTRAINT fk_proc_estado_proceso FOREIGN KEY (id_EP) REFERENCES Estado_Proceso(id_EP)
) ENGINE=InnoDB;

CREATE TABLE Te_Mac (
    id_TM SMALLINT NOT NULL AUTO_INCREMENT,
    foto VARBINARY(2000),
    desc VARCHAR(255),
    direc VARCHAR(255),
    id_MP SMALLINT NOT NULL,
    fh_EM TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_TM),
    CONSTRAINT fk_temac_macpr FOREIGN KEY (id_MP) REFERENCES Mac_PR(id_MP)
) ENGINE=InnoDB;

CREATE TABLE Ver_Mac (
    id_VM SMALLINT NOT NULL AUTO_INCREMENT,
    id_MP SMALLINT NOT NULL,
    id_Ba SMALLINT NOT NULL,
    direc VARCHAR(255),
    foto VARBINARY(2000),
    fh_mv TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    descr VARCHAR(255),
    PRIMARY KEY (id_VM),
    CONSTRAINT fk_vermac_macpr FOREIGN KEY (id_MP) REFERENCES Mac_PR(id_MP),
    CONSTRAINT fk_vermac_barrio FOREIGN KEY (id_Ba) REFERENCES Barrio(id_Ba)
) ENGINE=InnoDB;

CREATE TABLE Evento (
    id_EV SMALLINT NOT NULL AUTO_INCREMENT,
    id_Sed SMALLINT NOT NULL,
    id_Ep SMALLINT NOT NULL,
    foto VARBINARY(2000),
    descr VARCHAR(255),
    ev_Nom VARCHAR(60) NOT NULL,
    direc VARCHAR(100),
    fh_I TIMESTAMP NULL DEFAULT NULL,
    fh_F TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (id_EV),
    CONSTRAINT fk_evento_sede FOREIGN KEY (id_Sed) REFERENCES Sede(id_Sed),
    CONSTRAINT fk_evento_estado FOREIGN KEY (id_Ep) REFERENCES Estado_P(id_Ep)
) ENGINE=InnoDB;

CREATE TABLE Donacion (
    id_Donacion SMALLINT NOT NULL AUTO_INCREMENT,
    id_Fun SMALLINT NOT NULL,
    id_Sed SMALLINT NULL,
    id_cli SMALLINT NULL,
    monto DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    tipo_donacion VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    fecha_donacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_Donacion),
    CONSTRAINT fk_donacion_fundacion
    FOREIGN KEY (id_Fun) REFERENCES Fundacion(id_Fun)
    ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_donacion_sede
    FOREIGN KEY (id_Sed) REFERENCES Sede(id_Sed)
    ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_donacion_cliente
    FOREIGN KEY (id_cli) REFERENCES Cliente(id_cli)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

USE patitas_perdidas_bd;

-- 1. Catálogos base
INSERT INTO Tip_Doc (id_TD, tip_D) VALUES (1, 'CC');

INSERT INTO Condicion (id_CD, condi) VALUES
(1, 'Excelente'),
(2, 'Buena'),
(3, 'Regular');

INSERT INTO Especie (id_Esp, especie) VALUES
(1, 'Perro'),
(2, 'Gato');

INSERT INTO Sexo (id_Sex, sexo) VALUES
(1, 'Hembra'),
(2, 'Macho'),
(3, 'Desconocido');