CREATE TABLE IF NOT EXISTS propietario (
    cui VARCHAR(13) PRIMARY KEY,
    nit VARCHAR(13),
    nombre VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INTEGER PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    clave VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS marca (
    id_marca INTEGER PRIMARY KEY,
    marca VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS modelo (
    id_modelo INTEGER PRIMARY KEY,
    modelo VARCHAR(60) NOT NULL,
    id_marca INTEGER NOT NULL REFERENCES marca(id_marca)
);

CREATE TABLE IF NOT EXISTS linea (
    id_linea INTEGER PRIMARY KEY,
    linea VARCHAR(60) NOT NULL,
    id_modelo INTEGER NOT NULL REFERENCES modelo(id_modelo)
);

CREATE TABLE IF NOT EXISTS color (
    id_color INTEGER PRIMARY KEY,
    color VARCHAR(40) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tarjeta (
    no_tarjeta VARCHAR(12) PRIMARY KEY,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_emision DATE NOT NULL,
    anio INTEGER NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    CONSTRAINT verificar_vencimiento CHECK (fecha_vencimiento >= fecha_emision)
);

CREATE TABLE IF NOT EXISTS vehiculo (
    placa VARCHAR(11) PRIMARY KEY,
    vin VARCHAR(17),
    chasis VARCHAR(17),
    serie VARCHAR(17),
    tipo VARCHAR(40),
    uso VARCHAR(40),
    motor VARCHAR(20),
    cilindros INTEGER,
    cilindrada INTEGER,
    ejes INTEGER,
    peso NUMERIC(10,2),
    asientos INTEGER,
    id_color INTEGER REFERENCES color(id_color),
    id_linea INTEGER REFERENCES linea(id_linea),
    no_tarjeta VARCHAR(12) UNIQUE NOT NULL REFERENCES tarjeta(no_tarjeta),
    cui VARCHAR(13) NOT NULL REFERENCES propietario(cui)
);

CREATE TABLE IF NOT EXISTS registro (
    id_registro INTEGER PRIMARY KEY,
    fecha_registro DATE NOT NULL,
    hora_registro TIME NOT NULL,
    estado BOOLEAN NOT NULL,
    id_usuario INTEGER REFERENCES usuario(id_usuario),
    placa VARCHAR(11) REFERENCES vehiculo(placa)
);
