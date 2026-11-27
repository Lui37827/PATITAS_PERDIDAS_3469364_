DROP DATABASE IF EXISTS patitas_perdidas_bd;

CREATE DATABASE patitas_perdidas_bd
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE patitas_perdidas_bd;

-- 1. Catálogos base
CREATE TABLE especie (
    id_Esp SMALLINT NOT NULL AUTO_INCREMENT,
    especie VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_Esp)
) ENGINE=InnoDB;

CREATE TABLE sexo (
    id_Sex SMALLINT NOT NULL AUTO_INCREMENT,
    sexo VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_Sex)
) ENGINE=InnoDB;

CREATE TABLE estado_p (
    id_Ep SMALLINT NOT NULL AUTO_INCREMENT,
    est_Pu VARCHAR(30) NOT NULL,
    PRIMARY KEY (id_Ep)
) ENGINE=InnoDB;

CREATE TABLE estado_proceso (
    id_EP SMALLINT NOT NULL AUTO_INCREMENT,
    estado VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_EP)
) ENGINE=InnoDB;

CREATE TABLE localidad (
    id_Loc SMALLINT NOT NULL AUTO_INCREMENT,
    loc VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_Loc)
) ENGINE=InnoDB;

CREATE TABLE vacunas (
    id_VC SMALLINT NOT NULL AUTO_INCREMENT,
    vacuna VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_VC)
) ENGINE=InnoDB;

-- 2. Actores principales
CREATE TABLE director (
    id_di SMALLINT NOT NULL AUTO_INCREMENT,
    nom_Di VARCHAR(50) NOT NULL,
    ape_di VARCHAR(50) NOT NULL,
    doc VARCHAR(20) NOT NULL,
    tel VARCHAR(15),
    correo VARCHAR(100) NOT NULL,
    fec_na DATE NULL,
    PRIMARY KEY (id_di)
) ENGINE=InnoDB;

CREATE TABLE fundacion (
    id_Fun SMALLINT NOT NULL AUTO_INCREMENT,
    id_Di SMALLINT NOT NULL,
    nit VARCHAR(20) NOT NULL,
    tel VARCHAR(15),
    correo VARCHAR(100),
    nom VARCHAR(80) NOT NULL,
    red_S VARCHAR(255),
    mision VARCHAR(255),
    vision VARCHAR(255),
    PRIMARY KEY (id_Fun),
    CONSTRAINT fk_fundacion_director
    FOREIGN KEY (id_Di) REFERENCES director(id_di)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE director_fundacion (
    Directorid_Di SMALLINT NOT NULL,
    Fundacionid_Fun SMALLINT NOT NULL,
    PRIMARY KEY (Directorid_Di, Fundacionid_Fun),
    CONSTRAINT fk_df_director
    FOREIGN KEY (Directorid_Di) REFERENCES director(id_di)
    ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_df_fundacion
    FOREIGN KEY (Fundacionid_Fun) REFERENCES fundacion(id_Fun)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE cliente (
    id_cli SMALLINT NOT NULL AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    ape VARCHAR(50) NOT NULL,
    doc VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    tel VARCHAR(15),
    fec_na DATE NULL,
    PRIMARY KEY (id_cli)
) ENGINE=InnoDB;

-- 3. Ubicaciones, sedes y razas
CREATE TABLE barrio (
    id_Ba SMALLINT NOT NULL AUTO_INCREMENT,
    barrio VARCHAR(60) NOT NULL,
    id_Loc SMALLINT NOT NULL,
    PRIMARY KEY (id_Ba),
    CONSTRAINT fk_barrio_localidad
    FOREIGN KEY (id_Loc) REFERENCES localidad(id_Loc)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE sede (
    id_Sed SMALLINT NOT NULL AUTO_INCREMENT,
    id_Fun SMALLINT NOT NULL,
    id_Ba SMALLINT NOT NULL,
    nom_Se VARCHAR(60) NOT NULL,
    tel VARCHAR(15),
    PRIMARY KEY (id_Sed),
    CONSTRAINT fk_sede_fundacion
    FOREIGN KEY (id_Fun) REFERENCES fundacion(id_Fun)
    ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_sede_barrio
    FOREIGN KEY (id_Ba) REFERENCES barrio(id_Ba)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE raza (
    id_RZ SMALLINT NOT NULL AUTO_INCREMENT,
    raza VARCHAR(100) NOT NULL,
    id_Esp SMALLINT NOT NULL,
    raza_indefinida VARCHAR(100) NULL DEFAULT NULL,
    PRIMARY KEY (id_RZ),
    CONSTRAINT fk_raza_especie
    FOREIGN KEY (id_Esp) REFERENCES especie(id_Esp)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 4. Mascotas
CREATE TABLE mac_pr (
    id_MP SMALLINT NOT NULL AUTO_INCREMENT,
    id_Cli SMALLINT NOT NULL,
    id_Sex SMALLINT NOT NULL,
    id_RZ SMALLINT NOT NULL,
    id_Ep SMALLINT NOT NULL,
    id_Ba SMALLINT NOT NULL,
    m_Nom VARCHAR(50),
    foto VARBINARY(2000),
    edad DATE NULL,
    direc VARCHAR(100),
    fh_p TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    descri VARCHAR(255),
    PRIMARY KEY (id_MP),
    CONSTRAINT fk_macpr_cliente FOREIGN KEY (id_Cli) REFERENCES cliente(id_cli),
    CONSTRAINT fk_macpr_sexo FOREIGN KEY (id_Sex) REFERENCES sexo(id_Sex),
    CONSTRAINT fk_macpr_raza FOREIGN KEY (id_RZ) REFERENCES raza(id_RZ),
    CONSTRAINT fk_macpr_estado FOREIGN KEY (id_Ep) REFERENCES estado_p(id_Ep),
    CONSTRAINT fk_macpr_barrio FOREIGN KEY (id_Ba) REFERENCES barrio(id_Ba)
) ENGINE=InnoDB;

CREATE TABLE mac_ad (
    id_Adp SMALLINT NOT NULL AUTO_INCREMENT,
    id_Sed SMALLINT NOT NULL,
    id_Sex SMALLINT NOT NULL,
    id_Rz SMALLINT NOT NULL,
    id_EP SMALLINT NOT NULL,
    m_Nom VARCHAR(50) NOT NULL,
    edad DATE NULL,
    foto VARBINARY(2000),
    fh_P_A TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    fh_A_T TIMESTAMP NULL DEFAULT NULL,
    descri VARCHAR(255),
    esteril SMALLINT DEFAULT 0,
    dpara SMALLINT DEFAULT 0,
    PRIMARY KEY (id_Adp),
    CONSTRAINT fk_macad_sede FOREIGN KEY (id_Sed) REFERENCES sede(id_Sed),
    CONSTRAINT fk_macad_sexo FOREIGN KEY (id_Sex) REFERENCES sexo(id_Sex),
    CONSTRAINT fk_macad_raza FOREIGN KEY (id_Rz) REFERENCES raza(id_RZ),
    CONSTRAINT fk_macad_estado FOREIGN KEY (id_EP) REFERENCES estado_p(id_Ep)
) ENGINE=InnoDB;

CREATE TABLE mac_ad_vacunas (
    Mac_ADid_Adp SMALLINT NOT NULL,
    Vacunasid_VC SMALLINT NOT NULL,
    PRIMARY KEY (Mac_ADid_Adp, Vacunasid_VC),
    CONSTRAINT fk_madv_macad FOREIGN KEY (Mac_ADid_Adp) REFERENCES mac_ad(id_Adp) ON DELETE CASCADE,
    CONSTRAINT fk_madv_vacuna FOREIGN KEY (Vacunasid_VC) REFERENCES vacunas(id_VC) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Procesos, avistamientos, eventos y donaciones
CREATE TABLE proc_adp (
    id_PA SMALLINT NOT NULL AUTO_INCREMENT,
    id_CL SMALLINT NOT NULL,
    id_Adp SMALLINT NOT NULL,
    id_EP SMALLINT NOT NULL,
    direc VARCHAR(100),
    fh_I TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    fh_F TIMESTAMP NULL DEFAULT NULL,
    observacion VARCHAR(100) NULL DEFAULT NULL,
    condicion VARCHAR(100) NULL DEFAULT NULL,
    PRIMARY KEY (id_PA),
    CONSTRAINT fk_proc_cliente FOREIGN KEY (id_CL) REFERENCES cliente(id_cli),
    CONSTRAINT fk_proc_macad FOREIGN KEY (id_Adp) REFERENCES mac_ad(id_Adp),
    CONSTRAINT fk_proc_estado_proceso FOREIGN KEY (id_EP) REFERENCES estado_proceso(id_EP)
) ENGINE=InnoDB;

CREATE TABLE te_mac (
    id_TM SMALLINT NOT NULL AUTO_INCREMENT,
    foto VARBINARY(2000),
    descr VARCHAR(255),
    direc VARCHAR(255),
    id_MP SMALLINT NOT NULL,
    fh_EM TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_TM),
    CONSTRAINT fk_temac_macpr FOREIGN KEY (id_MP) REFERENCES mac_pr(id_MP)
) ENGINE=InnoDB;

CREATE TABLE ver_mac (
    id_VM SMALLINT NOT NULL AUTO_INCREMENT,
    id_MP SMALLINT NOT NULL,
    id_Ba SMALLINT NOT NULL,
    direc VARCHAR(255),
    foto VARBINARY(2000),
    fh_mv TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    descr VARCHAR(255),
    PRIMARY KEY (id_VM),
    CONSTRAINT fk_vermac_macpr FOREIGN KEY (id_MP) REFERENCES mac_pr(id_MP),
    CONSTRAINT fk_vermac_barrio FOREIGN KEY (id_Ba) REFERENCES barrio(id_Ba)
) ENGINE=InnoDB;

CREATE TABLE evento (
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
    CONSTRAINT fk_evento_sede FOREIGN KEY (id_Sed) REFERENCES sede(id_Sed),
    CONSTRAINT fk_evento_estado FOREIGN KEY (id_Ep) REFERENCES estado_p(id_Ep)
) ENGINE=InnoDB;

CREATE TABLE donacion (
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
    FOREIGN KEY (id_Fun) REFERENCES fundacion(id_Fun)
    ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_donacion_sede
    FOREIGN KEY (id_Sed) REFERENCES sede(id_Sed)
    ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT fk_donacion_cliente
    FOREIGN KEY (id_cli) REFERENCES cliente(id_cli)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

