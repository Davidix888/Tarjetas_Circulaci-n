INSERT INTO usuario (id_usuario, nombre_usuario, clave, rol) VALUES
(2, 'operador_demo', 'operador123', 'OPERADOR'),
(3, 'consultor_demo', 'consultor123', 'CONSULTOR')
ON CONFLICT (id_usuario) DO NOTHING;

INSERT INTO marca (id_marca, marca) VALUES
(1, 'TOYOTA'),
(2, 'HONDA')
ON CONFLICT (id_marca) DO NOTHING;

INSERT INTO modelo (id_modelo, modelo, id_marca) VALUES
(1, 'COROLLA', 1),
(2, 'CIVIC', 2)
ON CONFLICT (id_modelo) DO NOTHING;

INSERT INTO linea (id_linea, linea, id_modelo) VALUES
(1, 'SE', 1),
(2, 'EX', 2)
ON CONFLICT (id_linea) DO NOTHING;

INSERT INTO color (id_color, color) VALUES
(1, 'BLANCO'),
(2, 'NEGRO')
ON CONFLICT (id_color) DO NOTHING;
