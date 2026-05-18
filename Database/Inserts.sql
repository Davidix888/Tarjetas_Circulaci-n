--
-- PostgreSQL database dump
--


-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: color; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.color (id_color, color) VALUES (1, 'ROJO');
INSERT INTO public.color (id_color, color) VALUES (2, 'AZUL');
INSERT INTO public.color (id_color, color) VALUES (3, 'BLANCO');
INSERT INTO public.color (id_color, color) VALUES (4, 'GRIS');
INSERT INTO public.color (id_color, color) VALUES (5, 'NEGRO');
INSERT INTO public.color (id_color, color) VALUES (6, 'PLATA');
INSERT INTO public.color (id_color, color) VALUES (7, 'VERDE');
INSERT INTO public.color (id_color, color) VALUES (8, 'ROSADO');


--
-- Data for Name: marca; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.marca (id_marca, marca) VALUES (1, 'TVS');
INSERT INTO public.marca (id_marca, marca) VALUES (2, 'HONDA');
INSERT INTO public.marca (id_marca, marca) VALUES (3, 'MAZDA');
INSERT INTO public.marca (id_marca, marca) VALUES (4, 'NISSAN');
INSERT INTO public.marca (id_marca, marca) VALUES (5, 'TOYOTA');
INSERT INTO public.marca (id_marca, marca) VALUES (6, 'HYUNDAI');
INSERT INTO public.marca (id_marca, marca) VALUES (7, 'ISUZU');
INSERT INTO public.marca (id_marca, marca) VALUES (8, 'KIA');
INSERT INTO public.marca (id_marca, marca) VALUES (9, 'SUZUKI');
INSERT INTO public.marca (id_marca, marca) VALUES (10, 'YAMAHA');


--
-- Data for Name: modelo; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.modelo (id_modelo, modelo, id_marca) VALUES (1, '2025', 1);
INSERT INTO public.modelo (id_modelo, modelo, id_marca) VALUES (2, 'CIVIC', 2);
INSERT INTO public.modelo (id_modelo, modelo, id_marca) VALUES (3, 'COROLLA', 5);
INSERT INTO public.modelo (id_modelo, modelo, id_marca) VALUES (4, 'CX5', 3);
INSERT INTO public.modelo (id_modelo, modelo, id_marca) VALUES (5, 'SENTRA', 4);
INSERT INTO public.modelo (id_modelo, modelo, id_marca) VALUES (6, 'STRYKER125', 1);
INSERT INTO public.modelo (id_modelo, modelo, id_marca) VALUES (7, 'ACCENT', 6);
INSERT INTO public.modelo (id_modelo, modelo, id_marca) VALUES (8, 'DMAX', 7);
INSERT INTO public.modelo (id_modelo, modelo, id_marca) VALUES (9, 'FZ150', 10);
INSERT INTO public.modelo (id_modelo, modelo, id_marca) VALUES (10, 'GN125', 9);
INSERT INTO public.modelo (id_modelo, modelo, id_marca) VALUES (11, 'RIO', 8);
INSERT INTO public.modelo (id_modelo, modelo, id_marca) VALUES (12, 'TVS125', 1);
INSERT INTO public.modelo (id_modelo, modelo, id_marca) VALUES (13, 'RTA', 10);
INSERT INTO public.modelo (id_modelo, modelo, id_marca) VALUES (14, 'RAV4', 5);


--
-- Data for Name: linea; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (1, 'STRYKER 125', 1);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (2, 'EX', 2);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (3, 'SE', 3);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (4, 'STD', 6);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (5, 'SV', 5);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (6, 'TOURING', 4);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (7, 'ACCENT GLS', 7);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (8, 'CIVIC EX', 2);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (9, 'COROLLA SE', 3);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (10, 'CX-5 TOURING', 4);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (11, 'D-MAX LS', 8);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (12, 'FZ-S FI', 9);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (13, 'GN 125H', 10);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (14, 'RIO SEDAN', 11);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (15, 'SENTRA SV', 5);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (16, 'STRYKER 125', 12);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (17, 'LE', 13);
INSERT INTO public.linea (id_linea, linea, id_modelo) VALUES (18, '2024', 14);


--
-- Data for Name: propietario; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3011122230101', '45678912', 'JUAN CARLOS MORALES GARCIA');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3011122230102', '56789123', 'MARIA FERNANDA LOPEZ REYES');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3011122230103', '67891234', 'CARLOS EDUARDO MENDEZ CASTILLO');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3011122230104', '78912345', 'ANA SOFIA HERRERA DIAZ');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3011122230105', '89123456', 'LUIS FERNANDO CHAVEZ RUIZ');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3011122230106', '91234567', 'PAOLA ANDREA VASQUEZ MORALES');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3011122230107', '92345678', 'DIEGO ALEJANDRO GOMEZ PEREZ');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3011122230108', '93456789', 'KAREN ELIZABETH ESTRADA PONCE');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3011122230109', '94567891', 'MIGUEL ANGEL ALVAREZ TORRES');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3011122230110', '95678912', 'SOFIA MARCELA REYES CASTRO');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3011122230111', '96789123', 'ROBERTO EMILIO SANTOS MENDEZ');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3011122230112', '97891234', 'CLAUDIA PATRICIA MONTERROSO LOPEZ');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3011122230113', '98912345', 'OSCAR DANIEL MENJIVAR REYES');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3011122230114', '99123456', 'MELISSA JOHANNA ARANA CASTILLO');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3011122230115', '99234567', 'EDWIN MAURICIO PALMA HERRERA');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('1234567891011', '123456789', 'Manuel rojas');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('1234567897851', '9874561', 'GUSTAVO ROJAS');
INSERT INTO public.propietario (cui, nit, nombre) VALUES ('3142479710901', '117758493', 'LUIS DAVID IXQUIAC SAC');


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.usuario (id_usuario, rol, clave, nombre_usuario) VALUES (1, 'OPERADOR', 'Cruzita_2005', 'ldixquiac');
INSERT INTO public.usuario (id_usuario, rol, clave, nombre_usuario) VALUES (2, 'OPERADOR', 'operador123', 'operador_demo');
INSERT INTO public.usuario (id_usuario, rol, clave, nombre_usuario) VALUES (3, 'CONSULTOR', 'consultor123', 'consultor_demo');


--
-- Data for Name: registro; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (1, '2026-05-17', '21:33:32.436612', true, 1, 'M0822MRT');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (2, '2026-05-17', '22:24:07.609271', true, 1, 'M1201ABC');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (3, '2026-05-17', '22:24:07.609271', true, 1, 'M1202BCD');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (4, '2026-05-17', '22:24:07.609271', true, 1, 'M1203CDE');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (5, '2026-05-17', '22:24:07.609271', true, 1, 'M1204DEF');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (6, '2026-05-17', '22:24:07.609271', true, 1, 'M1205EFG');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (7, '2026-05-17', '22:24:07.609271', false, 1, 'M1206FGH');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (8, '2026-05-17', '22:24:07.609271', true, 1, 'M1207GHI');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (9, '2026-05-17', '22:24:07.609271', false, 1, 'M1208HIJ');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (10, '2026-05-17', '22:24:07.609271', true, 1, 'M1209IJK');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (11, '2026-05-17', '22:24:07.609271', false, 1, 'M1210JKL');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (12, '2026-05-17', '22:24:07.609271', true, 1, 'M1211KLM');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (13, '2026-05-17', '22:24:07.609271', true, 1, 'M1212LMN');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (14, '2026-05-17', '22:24:07.609271', true, 1, 'M1213MNO');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (15, '2026-05-17', '22:24:07.609271', true, 1, 'M1214NOP');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (16, '2026-05-17', '22:24:07.609271', true, 1, 'M1215OPQ');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (17, '2026-05-17', '22:24:07.609271', false, 1, 'M1216PQR');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (18, '2026-05-17', '22:24:07.609271', true, 1, 'M1217QRS');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (19, '2026-05-17', '22:24:07.609271', false, 1, 'M1218RST');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (20, '2026-05-17', '22:24:07.609271', true, 1, 'M1219STU');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (21, '2026-05-17', '22:24:07.609271', false, 1, 'M1220TUV');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (22, '2026-05-17', '22:26:33.122147', true, 1, 'M1221UVW');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (23, '2026-05-17', '22:26:33.122147', true, 1, 'M1222VWX');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (24, '2026-05-17', '22:26:33.122147', true, 1, 'M1223WXY');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (25, '2026-05-17', '22:26:33.122147', true, 1, 'M1224XYZ');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (26, '2026-05-17', '22:26:33.122147', true, 1, 'M1225YZA');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (27, '2026-05-17', '22:29:38.488378', false, 1, 'M1222VWX');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (28, '2026-05-17', '22:29:47.138187', true, 1, 'M1222VWX');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (29, '2026-05-17', '22:38:32.770053', true, 1, 'M1221UVW');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (30, '2026-05-17', '23:13:38.041941', false, 1, 'M1221UVW');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (31, '2026-05-17', '23:17:30.684814', false, 1, 'M1224XYZ');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (32, '2026-05-17', '23:17:46.498934', true, 1, 'M1221UVW');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (33, '2026-05-18', '18:36:38.881018', true, 1, 'M1201ABC');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (34, '2026-05-18', '18:47:46.041706', true, 1, 'M0822MRT');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (35, '2026-05-18', '18:51:54.856887', true, 1, 'M0123MJT');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (36, '2026-05-18', '18:54:53.549806', true, 1, 'P6889GTR');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (37, '2026-05-18', '18:56:33.679162', true, 1, 'P6889GTR');
INSERT INTO public.registro (id_registro, fecha_registro, hora_registro, estado, id_usuario, placa) VALUES (38, '2026-05-18', '18:56:46.202964', true, 1, 'P6889GTR');


--
-- Data for Name: tarjeta; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202501073733', true, '2026-05-17', 2025, '2027-05-17');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100001', true, '2026-05-07', 2024, '2027-05-22');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100002', true, '2026-04-27', 2025, '2027-05-27');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100003', true, '2026-04-17', 2023, '2027-06-01');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100004', true, '2026-04-07', 2025, '2027-06-06');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100005', true, '2026-03-28', 2022, '2027-06-11');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100006', false, '2026-03-18', 2024, '2027-06-16');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100007', true, '2026-03-08', 2024, '2027-06-21');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100008', true, '2026-02-26', 2021, '2027-06-26');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100009', true, '2026-02-16', 2023, '2027-07-01');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100010', false, '2026-02-06', 2022, '2027-07-06');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100011', true, '2026-01-27', 2020, '2027-07-11');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100012', true, '2026-01-17', 2025, '2027-07-16');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100013', true, '2026-01-07', 2024, '2027-07-21');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100014', true, '2025-12-28', 2025, '2027-07-26');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100015', true, '2025-12-18', 2023, '2027-07-31');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100016', false, '2025-12-08', 2022, '2027-08-05');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100017', true, '2025-11-28', 2024, '2027-08-10');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100018', true, '2025-11-18', 2021, '2027-08-15');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100019', true, '2025-11-08', 2025, '2027-08-20');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100020', true, '2025-10-29', 2024, '2027-08-25');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100023', true, '2025-09-29', 2020, '2026-04-02');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100025', true, '2025-09-09', 2024, '2026-03-23');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100022', true, '2025-10-09', 2023, '2026-04-07');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100101', true, '2026-05-17', 2026, '2027-05-17');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100024', false, '2025-09-19', 2022, '2026-03-28');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202601100021', true, '2025-10-19', 2021, '2026-04-12');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202512345678', true, '2026-05-18', 2026, '2027-05-18');
INSERT INTO public.tarjeta (no_tarjeta, estado, fecha_emision, anio, fecha_vencimiento) VALUES ('202512345679', true, '2026-05-18', 2026, '2027-05-18');


--
-- Data for Name: vehiculo; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1202BCD', 'VIN00000000000002', 'CHASIS00000000002', 'SERIE000000000002', 2, 0.2, 2, 125.0, 1, 16, '202601100002', '3011122230101', 'PARTICULAR', 'MOTOCICLETA', 'TVS1202A', 1);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1203CDE', 'VIN00000000000003', 'CHASIS00000000003', 'SERIE000000000003', 2, 1.4, 5, 1800.0, 5, 8, '202601100003', '3011122230102', 'PARTICULAR', 'AUTOMOVIL', 'R18A1203', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1204DEF', 'VIN00000000000004', 'CHASIS00000000004', 'SERIE000000000004', 2, 0.1, 2, 150.0, 2, 12, '202601100004', '3011122230102', 'PARTICULAR', 'MOTOCICLETA', 'YZ1501204', 1);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1205EFG', 'VIN00000000000005', 'CHASIS00000000005', 'SERIE000000000005', 2, 1.3, 5, 2000.0, 4, 15, '202601100005', '3011122230103', 'PARTICULAR', 'AUTOMOVIL', 'MR20D1205', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1206FGH', 'VIN00000000000006', 'CHASIS00000000006', 'SERIE000000000006', 2, 0.1, 2, 125.0, 5, 13, '202601100006', '3011122230103', 'PARTICULAR', 'MOTOCICLETA', 'GN1251206', 1);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1207GHI', 'VIN00000000000007', 'CHASIS00000000007', 'SERIE000000000007', 2, 1.6, 5, 2500.0, 3, 10, '202601100007', '3011122230104', 'PARTICULAR', 'CAMIONETA', 'PEVPS1207', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1208HIJ', 'VIN00000000000008', 'CHASIS00000000008', 'SERIE000000000008', 2, 1.2, 5, 1400.0, 6, 14, '202601100008', '3011122230104', 'PARTICULAR', 'AUTOMOVIL', 'G4LC1208', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1209IJK', 'VIN00000000000009', 'CHASIS00000000009', 'SERIE000000000009', 2, 1.2, 5, 1600.0, 2, 7, '202601100009', '3011122230105', 'PARTICULAR', 'AUTOMOVIL', 'G4FG1209', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1210JKL', 'VIN00000000000010', 'CHASIS00000000010', 'SERIE000000000010', 2, 1.9, 5, 3000.0, 3, 11, '202601100010', '3011122230105', 'COMERCIAL', 'PICK UP', 'RZ4E1210', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1211KLM', 'VIN00000000000011', 'CHASIS00000000011', 'SERIE000000000011', 2, 1.3, 5, 1800.0, 4, 9, '202601100011', '3011122230106', 'PARTICULAR', 'AUTOMOVIL', '2ZRFE1211', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1212LMN', 'VIN00000000000012', 'CHASIS00000000012', 'SERIE000000000012', 2, 0.2, 2, 125.0, 1, 16, '202601100012', '3011122230106', 'PARTICULAR', 'MOTOCICLETA', 'TVS1212A', 1);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1213MNO', 'VIN00000000000013', 'CHASIS00000000013', 'SERIE000000000013', 2, 1.4, 5, 1800.0, 5, 8, '202601100013', '3011122230107', 'PARTICULAR', 'AUTOMOVIL', 'R18A1213', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1214NOP', 'VIN00000000000014', 'CHASIS00000000014', 'SERIE000000000014', 2, 0.1, 2, 150.0, 2, 12, '202601100014', '3011122230107', 'PARTICULAR', 'MOTOCICLETA', 'YZ1501214', 1);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1215OPQ', 'VIN00000000000015', 'CHASIS00000000015', 'SERIE000000000015', 2, 1.3, 5, 2000.0, 6, 15, '202601100015', '3011122230108', 'PARTICULAR', 'AUTOMOVIL', 'MR20D1215', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1216PQR', 'VIN00000000000016', 'CHASIS00000000016', 'SERIE000000000016', 2, 0.1, 2, 125.0, 5, 13, '202601100016', '3011122230108', 'PARTICULAR', 'MOTOCICLETA', 'GN1251216', 1);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1217QRS', 'VIN00000000000017', 'CHASIS00000000017', 'SERIE000000000017', 2, 1.6, 5, 2500.0, 3, 10, '202601100017', '3011122230109', 'PARTICULAR', 'CAMIONETA', 'PEVPS1217', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1218RST', 'VIN00000000000018', 'CHASIS00000000018', 'SERIE000000000018', 2, 1.2, 5, 1400.0, 4, 14, '202601100018', '3011122230109', 'PARTICULAR', 'AUTOMOVIL', 'G4LC1218', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1219STU', 'VIN00000000000019', 'CHASIS00000000019', 'SERIE000000000019', 2, 1.2, 5, 1600.0, 2, 7, '202601100019', '3011122230110', 'PARTICULAR', 'AUTOMOVIL', 'G4FG1219', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1220TUV', 'VIN00000000000020', 'CHASIS00000000020', 'SERIE000000000020', 2, 1.9, 5, 3000.0, 3, 11, '202601100020', '3011122230110', 'COMERCIAL', 'PICK UP', 'RZ4E1220', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1225YZA', 'VIN00000000000025', 'CHASIS00000000025', 'SERIE000000000025', 2, 0.1, 2, 150.0, 2, 12, '202601100025', '3011122230115', 'PARTICULAR', 'MOTOCICLETA', 'YZ1501225', 1);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1222VWX', 'VIN00000000000022', 'CHASIS00000000022', 'SERIE000000000022', 2, 0.2, 2, 125.0, 1, 16, '202601100022', '3011122230112', 'PARTICULAR', 'MOTOCICLETA', 'TVS1222A', 1);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1221UVW', 'VIN00000000000021', 'CHASIS00000000021', 'SERIE000000000021', 2, 1.3, 5, 1800.0, 4, 9, '202601100021', '3011122230111', 'PARTICULAR', 'AUTOMOVIL', '2ZRFE1221', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1224XYZ', 'VIN00000000000024', 'CHASIS00000000024', 'SERIE000000000024', 2, 1.9, 5, 3000.0, 3, 11, '202601100024', '3011122230114', 'COMERCIAL', 'PICK UP', 'RZ4E1224', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1223WXY', 'VIN00000000000023', 'CHASIS00000000023', 'SERIE000000000023', 2, 1.3, 5, 2000.0, 5, 15, '202601100023', '3011122230113', 'PARTICULAR', 'AUTOMOVIL', 'MR20D1223', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1221UVW', 'VIN00000000000101', 'CHASIS00000000101', 'SERIE000000000101', 2, 1.3, 5, 1800.0, 4, 9, '202601100101', '3011122230111', 'PARTICULAR', 'AUTOMOVIL', 'MOTOR0101', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M1201ABC', 'VIN00000000000001', 'CHASIS00000000001', 'SERIE000000000001', 2, 1.3, 5, 1800.0, 6, 9, '202601100001', '3142479710901', 'PARTICULAR', 'AUTOMOVIL', '2ZRFE1201', 4);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M0822MRT', 'MD625BF46S1AN6999', 'MD625BF46S1AN6999', 'MD625BF46S1AN6999', 2, 0.0, 2, 125.0, 1, 1, '202501073733', '1234567891011', 'PARTICULAR', 'MOTOCICLETA', 'HF4AS19B0987', 1);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('M0123MJT', 'MD625BF46S1AN6991', 'MD625BF46S1AN6991', 'MD625BF46S1AN6991', 2, 0.0, 2, 150.0, 2, 17, '202512345678', '1234567897851', 'PARTICULAR', 'MOTOCICLETA', 'H123G456I789', 2);
INSERT INTO public.vehiculo (placa, vin, chasis, serie, ejes, peso, asientos, cilindrada, id_color, id_linea, no_tarjeta, cui, uso, tipo, motor, cilindros) VALUES ('P6889GTR', 'MD625BF46S1AN6912', 'MD625BF46S1AN6912', 'MD625BF46S1AN6912', 4, 1.0, 4, 2500.0, 8, 18, '202512345679', '1234567897851', 'PARTICULAR', 'AUTOMOVIL', 'HF4AS19B0981', 4);


--
-- Name: color_id_color_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.color_id_color_seq', 1, false);


--
-- Name: linea_id_linea_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.linea_id_linea_seq', 1, false);


--
-- Name: marca_id_marca_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.marca_id_marca_seq', 1, false);


--
-- Name: modelo_id_modelo_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.modelo_id_modelo_seq', 1, false);


--
-- Name: registro_id_registro_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.registro_id_registro_seq', 1, false);


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 1, false);


--
-- PostgreSQL database dump complete
--


