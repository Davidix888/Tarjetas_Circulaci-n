import psycopg2

DB_CONFIG = {
    "host": "127.0.0.1", "port": 5432,
    "database": "proyecto_tarjeta_circulacion",
    "user": "postgres", "password": "Cruzita_2005"
}

commands = [
    # CUI: El DPI en Guatemala tiene exactamente 13 dígitos
    "ALTER TABLE propietario ALTER COLUMN cui TYPE VARCHAR(13);",
    "ALTER TABLE vehiculo ALTER COLUMN cui TYPE VARCHAR(13);",
    
    # NIT: Tradicionalmente 7-9 caracteres, pero ahora la SAT usa el CUI (13 dígitos) para personas
    "ALTER TABLE propietario ALTER COLUMN nit TYPE VARCHAR(13);",
    
    # VIN, Chasis, Serie: El estándar internacional es de 17 caracteres
    "ALTER TABLE vehiculo ALTER COLUMN vin TYPE VARCHAR(17);",
    "ALTER TABLE vehiculo ALTER COLUMN chasis TYPE VARCHAR(17);",
    "ALTER TABLE vehiculo ALTER COLUMN serie TYPE VARCHAR(17);",
    
    # Placa: En Guatemala tiene 7 caracteres (ej. P001ABC), pero la tarjeta que subiste tiene "M0 - 822MRT", lo cual son 11 caracteres tomando en cuenta los espacios y el guión. Lo dejaremos en 11.
    "ALTER TABLE vehiculo ALTER COLUMN placa TYPE VARCHAR(11);",
    "ALTER TABLE registro ALTER COLUMN placa TYPE VARCHAR(11);",
    
    # No. Tarjeta: El formato de SAT visto en la tarjeta es de 12 dígitos
    "ALTER TABLE tarjeta ALTER COLUMN no_tarjeta TYPE VARCHAR(12);",
    "ALTER TABLE vehiculo ALTER COLUMN no_tarjeta TYPE VARCHAR(12);",
    
    # Motor: No hay estándar estricto, pero suele tener hasta 20 caracteres
    "ALTER TABLE vehiculo ALTER COLUMN motor TYPE VARCHAR(20);"
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
    print("Reglas estrictas aplicadas.")
except Exception as e:
    print(f"Error de conexión: {e}")
