# Proyecto Tarjetas de Circulacion

## Tecnologias utilizadas
- Python 3
- Flask
- Flask-CORS
- PostgreSQL
- Psycopg2
- HTML, CSS y JavaScript

## Estructura del repositorio
- `Database/`
  - `Schema.sql`
  - `Inserts.sql`
- `Backend/`
  - `app.py`
  - `requirements.txt`
- `Frontend/`
  - `templates/`
  - `static/`
- `Docs/`
  - `Modelo_ER.jpg`
  - `Modelo_relacional.md`

## Instrucciones de instalacion
1. Instalar Python 3 y PostgreSQL.
2. Crear la base de datos en PostgreSQL:
   - `proyecto_tarjeta_circulacion`
3. Ejecutar el script de esquema:
   - `Database/Schema.sql`
4. Ejecutar el script de inserciones iniciales:
   - `Database/Inserts.sql`
5. Instalar dependencias del backend:
   - `pip install -r Backend/requirements.txt`

## Como ejecutar el proyecto
1. Verificar que PostgreSQL este encendido.
2. Ejecutar el backend:
   - `python Backend/app.py`
3. Abrir en navegador:
   - `http://127.0.0.1:5000`

## Credenciales necesarias
### PostgreSQL
- Host: `127.0.0.1`
- Puerto: `5432`
- Usuario: `Usuario postgres`
- Contrasena: `Constraseña postgres`
- Base de datos: `proyecto_tarjeta_circulacion`

### Usuario del sistema (datos de ejemplo)
- Usuario: `ldixquiac`
- Clave: `Cruzita_2005`
- Rol: `OPERADOR`

- Usuario: `consultor_demo`
- Clave: `consultor123`
- Rol: `CONSULTOR`

## Puerto utilizado
- Aplicacion Flask: `5000`
- PostgreSQL: `5432`

## Nombre de la base de datos
- `proyecto_tarjeta_circulacion`
