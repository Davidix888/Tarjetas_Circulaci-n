import psycopg2

DB_CONFIG = {
    "host": "127.0.0.1", "port": 5432,
    "database": "proyecto_tarjeta_circulacion",
    "user": "postgres", "password": "Cruzita_2005"
}

commands = [
    "ALTER TABLE tarjeta ALTER COLUMN no_tarjeta TYPE VARCHAR(50);",
    "ALTER TABLE vehiculo ALTER COLUMN no_tarjeta TYPE VARCHAR(50);",
    
    "ALTER TABLE propietario ALTER COLUMN cui TYPE VARCHAR(50);",
    "ALTER TABLE vehiculo ALTER COLUMN cui TYPE VARCHAR(50);",
    
    "ALTER TABLE vehiculo ALTER COLUMN placa TYPE VARCHAR(30);",
    "ALTER TABLE registro ALTER COLUMN placa TYPE VARCHAR(30);",
    
    "ALTER TABLE vehiculo ALTER COLUMN vin TYPE VARCHAR(100);",
    "ALTER TABLE vehiculo ALTER COLUMN chasis TYPE VARCHAR(100);",
    "ALTER TABLE vehiculo ALTER COLUMN serie TYPE VARCHAR(100);",
    "ALTER TABLE vehiculo ALTER COLUMN tipo TYPE VARCHAR(100);",
    "ALTER TABLE vehiculo ALTER COLUMN uso TYPE VARCHAR(100);",
    "ALTER TABLE vehiculo ALTER COLUMN motor TYPE VARCHAR(100);",
    
    "ALTER TABLE propietario ALTER COLUMN nit TYPE VARCHAR(30);",
    "ALTER TABLE propietario ALTER COLUMN nombre TYPE VARCHAR(255);",
    
    "ALTER TABLE color ALTER COLUMN color TYPE VARCHAR(150);",
    "ALTER TABLE marca ALTER COLUMN marca TYPE VARCHAR(150);",
    "ALTER TABLE modelo ALTER COLUMN modelo TYPE VARCHAR(150);",
    "ALTER TABLE linea ALTER COLUMN linea TYPE VARCHAR(150);"
]

try:
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()
    for cmd in commands:
        try:
            cur.execute(cmd)
            print(f"Éxito: {cmd}")
        except Exception as e:
            print(f"Error en {cmd}: {e}")
            conn.rollback()
    conn.commit()
    cur.close()
    conn.close()
    print("Todas las columnas han sido actualizadas.")
except Exception as e:
    print(f"Error de conexión: {e}")
