import psycopg2

DB_CONFIG = {
    "host": "127.0.0.1", "port": 5432,
    "database": "proyecto_tarjeta_circulacion",
    "user": "postgres", "password": "Cruzita_2005"
}

conn = psycopg2.connect(**DB_CONFIG)
cur = conn.cursor()
cur.execute("SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'verificar_vencimiento';")
print(cur.fetchone()[0])
cur.close()
conn.close()
