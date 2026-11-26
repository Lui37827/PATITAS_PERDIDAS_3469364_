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

INSERT INTO Estado_P (id_Ep, est_Pu) VALUES
(1, 'Disponible'),
(2, 'En proceso'),
(3, 'Adoptada'),
(4, 'Perdida'),
(5, 'Encontrada'),
(6, 'Activo'),
(7, 'Finalizado'),
(8, 'Cancelado'),
(9, 'Pendiente'),
(10, 'Aceptada'),
(11, 'Rechazada');

INSERT INTO Localidad (id_Loc, loc) VALUES
(1, 'Chapinero'),
(2, 'Usaquén'),
(3, 'Teusaquillo'),
(4, 'Suba');

INSERT INTO Barrio (id_Ba, barrio, id_Loc) VALUES
(1, 'Chicó', 2),
(2, 'Chapinero Central', 1),
(3, 'Teusaquillo Centro', 3),
(4, 'Niza', 4);

INSERT INTO Vacunas (id_VC, vacuna) VALUES
(1, 'Rabia'),
(2, 'Parvovirus'),
(3, 'Triple Felina');

INSERT INTO Raza (id_RZ, raza, id_Esp) VALUES
(1, 'Criollo / Mestizo', 1),
(2, 'Labrador Retriever', 1),
(3, 'Golden Retriever', 1),
(4, 'Bulldog Francés', 1),
(5, 'Criollo / Mestizo', 2),
(6, 'Siamés', 2),
(7, 'Persa', 2);

-- 2. Directores, Fundaciones y Sedes
INSERT INTO Director (id_di, nom_Di, ape_di, id_TD, doc, tel, correo, fec_na) VALUES
(1, 'Mariana', 'Gutiérrez', 1, '1020202020', '3111111111', 'mariana@huellitascallejeras.org', NULL),
(2, 'Carlos', 'Mendoza', 1, '1020202021', '3201234567', 'info@proteccionbogota.org', NULL);

INSERT INTO Fundacion (id_Fun, id_Di, nit, tel, correo, nom, red_S, mision, vision) VALUES
(1, 1, '900987123-1', '3104567890', 'contacto@huellitascallejeras.org', 'Fundación Huellitas Callejeras', '@huellitascallejeras', 'Rescate y adopción responsable', 'Cero animales en situación de calle'),
(2, 2, '900654321-9', '3201234567', 'info@proteccionbogota.org', 'Protección Animal Bogotá', '@proteccionbogota', 'Bienestar animal en Bogotá', 'Ciudad protectora de animales');

INSERT INTO Director_Fundacion (Directorid_Di, Fundacionid_Fun) VALUES
(1, 1),
(2, 2);