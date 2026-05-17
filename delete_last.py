import psycopg2

DB_CONFIG = {
    "host": "127.0.0.1", "port": 5432,
    "database": "proyecto_tarjeta_circulacion",
    "user": "postgres", "password": "Cruzita_2005"
}

conn = psycopg2.connect(**DB_CONFIG)
cur = conn.cursor()

# Find the last inserted vehiculo
cur.execute("SELECT no_tarjeta, placa FROM vehiculo ORDER BY no_tarjeta DESC LIMIT 1;")
row = cur.fetchone()
if row:
    no_tarjeta = row[0]
    placa = row[1]
    print(f"Borrando último registro: Tarjeta {no_tarjeta}, Placa {placa}")
    
    # Delete from registro associated with this placa
    cur.execute("DELETE FROM registro WHERE placa = %s;", (placa,))
    
    # Delete vehiculo
    cur.execute("DELETE FROM vehiculo WHERE no_tarjeta = %s;", (no_tarjeta,))
    
    # Delete tarjeta
    cur.execute("DELETE FROM tarjeta WHERE no_tarjeta = %s;", (no_tarjeta,))
    
    conn.commit()
    print("Borrados exitosamente.")
else:
    print("No hay vehículos para borrar.")

cur.close()
conn.close()
