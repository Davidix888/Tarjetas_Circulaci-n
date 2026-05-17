from flask import Flask, jsonify, request, render_template, session, redirect, url_for
from flask_cors import CORS
import psycopg2, psycopg2.extras
from datetime import date, time
from functools import wraps
import traceback

app = Flask(__name__)
app.secret_key = 'tarjetas_gt_2024_secret'
CORS(app, supports_credentials=True)

DB_CONFIG = {
    "host": "127.0.0.1", "port": 5432,
    "database": "proyecto_tarjeta_circulacion",
    "user": "postgres", "password": "Cruzita_2005"
}

def get_db():
    return psycopg2.connect(**DB_CONFIG)

def serialize(obj):
    if isinstance(obj, (date, time)): return str(obj)
    return obj

def row_to_dict(row):
    return {k: serialize(v) for k, v in row.items()} if row else None

def rows_to_list(rows):
    return [row_to_dict(r) for r in rows]

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "No autenticado"}), 401
        return f(*args, **kwargs)
    return decorated

# ── Helpers find-or-create (IDs manuales porque no son SERIAL) ────────────────
def find_or_create_marca(cur, nombre):
    nombre = nombre.strip().upper()
    cur.execute("SELECT id_marca FROM marca WHERE UPPER(marca)=%s", (nombre,))
    row = cur.fetchone()
    if row: return row[0]
    cur.execute("SELECT COALESCE(MAX(id_marca),0)+1 FROM marca")
    next_id = cur.fetchone()[0]
    cur.execute("INSERT INTO marca(id_marca,marca) VALUES(%s,%s)", (next_id, nombre))
    return next_id

def find_or_create_modelo(cur, nombre, id_marca):
    nombre = nombre.strip().upper()
    cur.execute("SELECT id_modelo FROM modelo WHERE UPPER(modelo)=%s AND id_marca=%s", (nombre, id_marca))
    row = cur.fetchone()
    if row: return row[0]
    cur.execute("SELECT COALESCE(MAX(id_modelo),0)+1 FROM modelo")
    next_id = cur.fetchone()[0]
    cur.execute("INSERT INTO modelo(id_modelo,modelo,id_marca) VALUES(%s,%s,%s)", (next_id, nombre, id_marca))
    return next_id

def find_or_create_linea(cur, nombre, id_modelo):
    nombre = nombre.strip().upper()
    cur.execute("SELECT id_linea FROM linea WHERE UPPER(linea)=%s AND id_modelo=%s", (nombre, id_modelo))
    row = cur.fetchone()
    if row: return row[0]
    cur.execute("SELECT COALESCE(MAX(id_linea),0)+1 FROM linea")
    next_id = cur.fetchone()[0]
    cur.execute("INSERT INTO linea(id_linea,linea,id_modelo) VALUES(%s,%s,%s)", (next_id, nombre, id_modelo))
    return next_id

def find_or_create_color(cur, nombre):
    nombre = nombre.strip().upper()
    cur.execute("SELECT id_color FROM color WHERE UPPER(color)=%s", (nombre,))
    row = cur.fetchone()
    if row: return row[0]
    cur.execute("SELECT COALESCE(MAX(id_color),0)+1 FROM color")
    next_id = cur.fetchone()[0]
    cur.execute("INSERT INTO color(id_color,color) VALUES(%s,%s)", (next_id, nombre))
    return next_id

# ── Páginas ───────────────────────────────────────────────────────────────────
@app.route("/")
def index():
    if 'user_id' not in session:
        return redirect(url_for('login_page'))
    return render_template("index.html")

@app.route("/login")
def login_page():
    if 'user_id' in session:
        return redirect(url_for('index'))
    return render_template("login.html")

# ── Auth API ──────────────────────────────────────────────────────────────────
@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.json
    usuario = data.get("usuario", "").strip()
    clave   = data.get("clave", "")
    try:
        conn = get_db(); cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT id_usuario, nombre_usuario, rol, clave FROM usuario WHERE nombre_usuario=%s", (usuario,))
        u = cur.fetchone(); cur.close(); conn.close()
        if not u or u['clave'] != clave:
            return jsonify({"error": "Usuario o contraseña incorrectos"}), 401
        session['user_id']   = u['id_usuario']
        session['user_name'] = u['nombre_usuario']
        session['user_rol']  = u['rol']
        return jsonify({"id_usuario": u['id_usuario'], "nombre_usuario": u['nombre_usuario'], "rol": u['rol']})
    except Exception as e:
        traceback.print_exc(); return jsonify({"error": str(e)}), 500

@app.route("/api/logout", methods=["POST"])
def api_logout():
    session.clear()
    return jsonify({"message": "Sesión cerrada"})

@app.route("/api/me")
def api_me():
    if 'user_id' not in session:
        return jsonify({"error": "No autenticado"}), 401
    return jsonify({"id_usuario": session['user_id'], "nombre_usuario": session['user_name'], "rol": session['user_rol']})

# ── Stats ─────────────────────────────────────────────────────────────────────
@app.route("/api/stats")
@login_required
def get_stats():
    try:
        conn = get_db(); cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT COUNT(*) AS total FROM tarjeta")
        total = cur.fetchone()["total"]
        cur.execute("SELECT COUNT(*) AS v FROM tarjeta WHERE estado=TRUE")
        activas = cur.fetchone()["v"]
        cur.execute("SELECT COUNT(*) AS v FROM tarjeta WHERE estado=FALSE")
        inactivas = cur.fetchone()["v"]
        cur.execute("SELECT COUNT(*) AS v FROM tarjeta WHERE fecha_vencimiento < CURRENT_DATE AND estado=TRUE")
        vencidas = cur.fetchone()["v"]
        cur.execute("SELECT COUNT(*) AS v FROM propietario")
        propietarios = cur.fetchone()["v"]
        cur.close(); conn.close()
        return jsonify({"total": total, "activas": activas, "inactivas": inactivas, "vencidas": vencidas, "propietarios": propietarios})
    except Exception as e:
        traceback.print_exc(); return jsonify({"error": str(e)}), 500

# ── Tarjetas ──────────────────────────────────────────────────────────────────
TARJETA_JOIN = """
    SELECT t.no_tarjeta, t.estado AS tarjeta_estado, t.fecha_emision, t.anio, t.fecha_vencimiento,
           v.placa, v.vin, v.chasis, v.serie, v.tipo, v.uso, v.motor,
           v.cilindros, v.cilindrada, v.ejes, v.peso, v.asientos,
           v.id_color, v.id_linea,
           c.color, ma.marca, mo.modelo, li.linea,
           p.cui, p.nit, p.nombre AS propietario_nombre
    FROM tarjeta t
    LEFT JOIN vehiculo   v  ON t.no_tarjeta = v.no_tarjeta
    LEFT JOIN color      c  ON v.id_color   = c.id_color
    LEFT JOIN linea      li ON v.id_linea   = li.id_linea
    LEFT JOIN modelo     mo ON li.id_modelo = mo.id_modelo
    LEFT JOIN marca      ma ON mo.id_marca  = ma.id_marca
    LEFT JOIN propietario p ON v.cui        = p.cui
"""

@app.route("/api/tarjetas")
@login_required
def get_tarjetas():
    try:
        conn = get_db(); cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(TARJETA_JOIN + " ORDER BY t.no_tarjeta")
        rows = cur.fetchall(); cur.close(); conn.close()
        return jsonify(rows_to_list(rows))
    except Exception as e:
        traceback.print_exc(); return jsonify({"error": str(e)}), 500

@app.route("/api/tarjetas/<no_tarjeta>")
@login_required
def get_tarjeta(no_tarjeta):
    try:
        conn = get_db(); cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(TARJETA_JOIN + " WHERE t.no_tarjeta=%s", (no_tarjeta,))
        row = cur.fetchone(); cur.close(); conn.close()
        if not row: return jsonify({"error": "No encontrada"}), 404
        return jsonify(row_to_dict(row))
    except Exception as e:
        traceback.print_exc(); return jsonify({"error": str(e)}), 500

@app.route("/api/tarjetas", methods=["POST"])
@login_required
def crear_tarjeta():
    data = request.json
    try:
        conn = get_db(); cur = conn.cursor()

        # Normalizar a mayúsculas
        def up(k): return (data.get(k) or '').strip().upper() or None
        def clean_placa(k):
            v = up(k)
            return v.replace(' ', '').replace('-', '') if v else None

        # Propietario
        cur.execute("SELECT cui FROM propietario WHERE cui=%s", (data["cui"],))
        if not cur.fetchone():
            cur.execute("INSERT INTO propietario(cui,nit,nombre) VALUES(%s,%s,%s)",
                        (data["cui"].strip(), up("nit"), up("nombre_propietario")))
        else:
            cur.execute("UPDATE propietario SET nit=%s, nombre=%s WHERE cui=%s",
                        (up("nit"), up("nombre_propietario"), data["cui"].strip()))

        # Catálogos (find-or-create)
        id_marca  = find_or_create_marca(cur, data["marca"])
        id_modelo = find_or_create_modelo(cur, data["modelo"], id_marca)
        id_linea  = find_or_create_linea(cur, data["linea"], id_modelo)
        id_color  = find_or_create_color(cur, data["color"])

        # Tarjeta
        cur.execute("""INSERT INTO tarjeta(no_tarjeta,estado,fecha_emision,anio,fecha_vencimiento)
                       VALUES(%s,TRUE,%s,%s,%s)""",
                    (data["no_tarjeta"].strip().upper(), data["fecha_emision"], data["anio"], data["fecha_vencimiento"]))

        # Vehículo
        cur.execute("""INSERT INTO vehiculo(placa,vin,chasis,serie,tipo,uso,motor,cilindros,
                                             cilindrada,ejes,peso,asientos,id_color,id_linea,no_tarjeta,cui)
                       VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                    (clean_placa("placa"), up("vin"), up("chasis"), up("serie"),
                     up("tipo"), up("uso"), up("motor"), data.get("cilindros"),
                     data.get("cilindrada"), data.get("ejes"), data.get("peso"),
                     data.get("asientos"), id_color, id_linea, data["no_tarjeta"].strip().upper(), data["cui"].strip()))

        # Registro
        cur.execute("""INSERT INTO registro(id_registro,fecha_registro,hora_registro,estado,id_usuario,placa)
                       VALUES((SELECT COALESCE(MAX(id_registro),0)+1 FROM registro),CURRENT_DATE,CURRENT_TIME,TRUE,%s,%s)""",
                    (session.get('user_id', 1), clean_placa("placa")))

        conn.commit(); cur.close(); conn.close()
        return jsonify({"message": "Tarjeta creada exitosamente"}), 201
    except Exception as e:
        conn.rollback(); traceback.print_exc(); return jsonify({"error": str(e)}), 500

@app.route("/api/tarjetas/<no_tarjeta>", methods=["PUT"])
@login_required
def actualizar_tarjeta(no_tarjeta):
    data = request.json
    try:
        conn = get_db(); cur = conn.cursor()

        # Si vienen texto para catálogos, find-or-create
        id_color = None
        if data.get("color"):
            id_color = find_or_create_color(cur, data["color"])

        id_linea = None
        if data.get("marca") and data.get("modelo") and data.get("linea"):
            id_marca  = find_or_create_marca(cur, data["marca"])
            id_modelo = find_or_create_modelo(cur, data["modelo"], id_marca)
            id_linea  = find_or_create_linea(cur, data["linea"], id_modelo)

        cur.execute("""UPDATE vehiculo SET
            motor      = COALESCE(%s, motor),
            id_color   = COALESCE(%s, id_color),
            id_linea   = COALESCE(%s, id_linea),
            tipo       = COALESCE(%s, tipo),
            uso        = COALESCE(%s, uso),
            cilindros  = COALESCE(%s, cilindros),
            cilindrada = COALESCE(%s, cilindrada),
            ejes       = COALESCE(%s, ejes),
            peso       = COALESCE(%s, peso),
            asientos   = COALESCE(%s, asientos)
            WHERE no_tarjeta=%s""",
            (data.get("motor"), id_color, id_linea, data.get("tipo"), data.get("uso"),
             data.get("cilindros"), data.get("cilindrada"), data.get("ejes"),
             data.get("peso"), data.get("asientos"), no_tarjeta))

        if data.get("fecha_vencimiento"):
            cur.execute("UPDATE tarjeta SET fecha_vencimiento=%s WHERE no_tarjeta=%s",
                        (data["fecha_vencimiento"], no_tarjeta))

        cur.execute("""INSERT INTO registro(id_registro,fecha_registro,hora_registro,estado,id_usuario,placa)
                       SELECT (SELECT COALESCE(MAX(id_registro),0)+1 FROM registro),CURRENT_DATE,CURRENT_TIME,TRUE,%s,placa FROM vehiculo WHERE no_tarjeta=%s""",
                    (session.get('user_id', 1), no_tarjeta))

        conn.commit(); cur.close(); conn.close()
        return jsonify({"message": "Actualizada correctamente"})
    except Exception as e:
        conn.rollback(); traceback.print_exc(); return jsonify({"error": str(e)}), 500

@app.route("/api/tarjetas/<no_tarjeta>/cambiar-dueno", methods=["PUT"])
@login_required
def cambiar_dueno(no_tarjeta):
    data = request.json
    try:
        conn = get_db(); cur = conn.cursor()
        cur.execute("SELECT cui FROM propietario WHERE cui=%s", (data["cui"],))
        if not cur.fetchone():
            cur.execute("INSERT INTO propietario(cui,nit,nombre) VALUES(%s,%s,%s)",
                        (data["cui"], data["nit"], data["nombre_propietario"]))
        cur.execute("UPDATE vehiculo SET cui=%s WHERE no_tarjeta=%s", (data["cui"], no_tarjeta))
        cur.execute("""INSERT INTO registro(id_registro,fecha_registro,hora_registro,estado,id_usuario,placa)
                       SELECT (SELECT COALESCE(MAX(id_registro),0)+1 FROM registro),CURRENT_DATE,CURRENT_TIME,TRUE,%s,placa FROM vehiculo WHERE no_tarjeta=%s""",
                    (session.get('user_id', 1), no_tarjeta))
        conn.commit(); cur.close(); conn.close()
        return jsonify({"message": "Propietario actualizado"})
    except Exception as e:
        conn.rollback(); traceback.print_exc(); return jsonify({"error": str(e)}), 500

@app.route("/api/tarjetas/<no_tarjeta>/desactivar", methods=["PUT"])
@login_required
def desactivar_tarjeta(no_tarjeta):
    data = request.json
    try:
        conn = get_db(); cur = conn.cursor()
        cur.execute("UPDATE tarjeta SET estado=FALSE WHERE no_tarjeta=%s", (no_tarjeta,))
        cur.execute("""INSERT INTO registro(id_registro,fecha_registro,hora_registro,estado,id_usuario,placa)
                       SELECT (SELECT COALESCE(MAX(id_registro),0)+1 FROM registro),CURRENT_DATE,CURRENT_TIME,FALSE,%s,placa FROM vehiculo WHERE no_tarjeta=%s""",
                    (session.get('user_id', 1), no_tarjeta))
        conn.commit(); cur.close(); conn.close()
        return jsonify({"message": "Tarjeta desactivada: " + data.get("motivo","")})
    except Exception as e:
        conn.rollback(); traceback.print_exc(); return jsonify({"error": str(e)}), 500

@app.route("/api/tarjetas/<no_tarjeta>/activar", methods=["PUT"])
@login_required
def activar_tarjeta(no_tarjeta):
    try:
        conn = get_db(); cur = conn.cursor()
        cur.execute("UPDATE tarjeta SET estado=TRUE WHERE no_tarjeta=%s", (no_tarjeta,))
        cur.execute("""INSERT INTO registro(id_registro,fecha_registro,hora_registro,estado,id_usuario,placa)
                       SELECT (SELECT COALESCE(MAX(id_registro),0)+1 FROM registro),CURRENT_DATE,CURRENT_TIME,TRUE,%s,placa FROM vehiculo WHERE no_tarjeta=%s""",
                    (session.get('user_id', 1), no_tarjeta))
        conn.commit(); cur.close(); conn.close()
        return jsonify({"message": "Tarjeta reactivada"})
    except Exception as e:
        conn.rollback(); traceback.print_exc(); return jsonify({"error": str(e)}), 500

# ── Catálogos (para autocomplete) ─────────────────────────────────────────────
@app.route("/api/catalogo/marcas")
@login_required
def cat_marcas():
    conn = get_db(); cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT id_marca, marca FROM marca ORDER BY marca")
    r = rows_to_list(cur.fetchall()); cur.close(); conn.close(); return jsonify(r)

@app.route("/api/catalogo/modelos")
@login_required
def cat_modelos():
    conn = get_db(); cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT id_modelo, modelo, id_marca FROM modelo ORDER BY modelo")
    r = rows_to_list(cur.fetchall()); cur.close(); conn.close(); return jsonify(r)

@app.route("/api/catalogo/lineas")
@login_required
def cat_lineas():
    conn = get_db(); cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT id_linea, linea, id_modelo FROM linea ORDER BY linea")
    r = rows_to_list(cur.fetchall()); cur.close(); conn.close(); return jsonify(r)

@app.route("/api/catalogo/colores")
@login_required
def cat_colores():
    conn = get_db(); cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT id_color, color FROM color ORDER BY color")
    r = rows_to_list(cur.fetchall()); cur.close(); conn.close(); return jsonify(r)

@app.route("/api/propietarios/<cui>")
@login_required
def get_propietario(cui):
    conn = get_db(); cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT cui,nit,nombre FROM propietario WHERE cui=%s", (cui,))
    row = cur.fetchone(); cur.close(); conn.close()
    if not row: return jsonify({"error": "No encontrado"}), 404
    return jsonify(row_to_dict(row))

@app.route("/api/propietarios")
@login_required
def get_propietarios():
    conn = get_db(); cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("SELECT cui,nit,nombre FROM propietario ORDER BY nombre")
    r = rows_to_list(cur.fetchall()); cur.close(); conn.close(); return jsonify(r)

# ── Registros / bitácora ──────────────────────────────────────────────────────
@app.route("/api/registros")
@login_required
def get_registros():
    try:
        conn = get_db(); cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""SELECT r.id_registro, r.fecha_registro, r.hora_registro,
                              r.estado, r.placa, u.nombre_usuario, u.rol
                       FROM registro r
                       LEFT JOIN usuario u ON r.id_usuario=u.id_usuario
                       ORDER BY r.fecha_registro DESC, r.hora_registro DESC LIMIT 200""")
        r = rows_to_list(cur.fetchall()); cur.close(); conn.close(); return jsonify(r)
    except Exception as e:
        traceback.print_exc(); return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
