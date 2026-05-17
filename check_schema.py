import psycopg2

DB_CONFIG = {
    "host": "127.0.0.1", "port": 5432,
    "database": "proyecto_tarjeta_circulacion",
    "user": "postgres", "password": "Cruzita_2005"
}

conn = psycopg2.connect(**DB_CONFIG)
cur = conn.cursor()
cur.execute("SELECT table_name, column_name, character_maximum_length FROM information_schema.columns WHERE table_schema='public' AND data_type='character varying' AND character_maximum_length < 15;")
rows = cur.fetchall()
for r in rows:
    print(r)
cur.close()
conn.close()
