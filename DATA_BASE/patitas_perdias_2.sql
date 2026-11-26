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

INSERT INTO Sede (id_Sed, id_Fun, id_Ba, nom_Se, tel) VALUES
(1, 1, 2, 'Sede Chapinero', '3104567890'),
(2, 2, 3, 'Sede Teusaquillo', '3201234567');

-- 3. Clientes / Adoptantes / Reportantes
INSERT INTO Cliente (id_cli, nom, ape, id_TD, doc, correo, tel, fec_na) VALUES
(1, 'Andrés Felipe', 'Silva', 1, '1030303030', 'andres.silva@correo.com', '3222222222', NULL),
(2, 'Valentina', 'Ríos', 1, '1040404040', 'valentina.rios@correo.com', '3333333333', NULL);

-- 4. Mascotas en Adopción (Mac_AD) y Mascotas Perdidas (Mac_PR)
INSERT INTO Mac_AD (id_Adp, id_Sed, id_Sex, id_Rz, id_EP, m_Nom, edad, foto, fh_P_A, fh_A_T, descri, esteril, dpara) VALUES
(1, 1, 2, 1, 1, 'Firulais', NULL, NULL, '2026-10-01 09:00:00', NULL, 'Perro muy activo, cariñoso y de color café claro. Tamaño mediano.', 1, 1),
(2, 1, 1, 5, 1, 'Luna', NULL, NULL, '2026-10-02 10:30:00', NULL, 'Gatica tricolor juguetona y muy tranquila. Tamaño pequeño.', 1, 1),
(3, 2, 2, 2, 1, 'Max', NULL, NULL, '2026-10-03 11:15:00', NULL, 'Labrador noble, le encanta jugar con la pelota. Tamaño grande.', 1, 1);

INSERT INTO Mac_AD_Vacunas (Mac_ADid_Adp, Vacunasid_VC) VALUES
(1, 1),
(2, 3),
(3, 1);