# Segundo Parcial - Trabajando en la Nube (COM610)

**Universidad San Francisco Xavier de Chuquisaca**  
**Docente:** Ing. Marcelo Quispe Ortega  
**Estudiante:** Luz Maria Muraña Mamani  
**Semestre:** 2/2026  

## Datos del despliegue

- **URL pública de la API (Nginx en puerto 80):** http://18.229.255.131
  - Endpoint de estado: http://18.229.255.131/health
  - Endpoint de libros: http://18.229.255.131/libros
- **Repositorio:** https://github.com/MariaM0325/parcial2-com610-lmmm
- **Ejecuciones de CI:** https://github.com/MariaM0325/parcial2-com610-lmmm/actions/workflows/ci.yml
- **Ejecuciones de CD:** https://github.com/MariaM0325/parcial2-com610-lmmm/actions/workflows/cd.yml
- **Imagen en Docker Hub:** `maria093/api-libros-lmmm`

## Recursos utilizados en AWS (Región sa-east-1)

- **VPC:** `vpc-014a186c03437e116` (misma red para la instancia EC2 y la base de datos RDS).
- **Instancia EC2:** `ec2-libros-lmmm` (`i-06c09d0ec8dc3cc1b`), Ubuntu Server 24.04 LTS (`t3.micro`), IP pública `18.229.255.131`.
- **Grupo de seguridad EC2:** `secgroup-ec2-lmmm` (`sg-0e52d4c909b2ff586`). Permite entrada por SSH (puerto 22) solo desde mi IP pública y HTTP (puerto 80) desde `0.0.0.0/0`. El puerto 3000 no está expuesto al exterior.
- **Instancia RDS:** `rds-libros-lmmm`, motor MySQL (`db.t3.micro`), con acceso público deshabilitado (`PubliclyAccessible = False`).
- **Grupo de seguridad RDS:** `secgroup-rds-lmmm` (`sg-0ee97aaf3961b7069`). Permite tráfico al puerto 3306 únicamente desde el grupo de seguridad de la instancia EC2 (`sg-0e52d4c909b2ff586`).

## Cómo ejecutar el proyecto localmente

1. Clonar el repositorio e instalar dependencias:
   ```bash
   npm ci
   ```

2. Crear el archivo `.env` tomando como base `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Ejecutar el script `db.sql` en MySQL para crear la base de datos `catalogo_libros_lmmm` y la tabla `libros`:
   ```bash
   mysql -h <DB_HOST> -u <DB_USER> -p < db.sql
   ```

4. Iniciar la aplicación:
   ```bash
   npm start
   ```

## Cómo ejecutar las pruebas

Las pruebas están hechas con Jest y Supertest en `tests/app.test.js`. Se usa un repositorio simulado en memoria para no depender de una conexión real a RDS durante la ejecución de los tests:

```bash
npm test
```

## Construcción y prueba con Docker

```bash
docker build -t api-libros-lmmm .
docker run -d --name api-libros-lmmm -p 127.0.0.1:3000:3000 --env-file .env api-libros-lmmm
curl http://127.0.0.1:3000/health
```

## Cómo verificar el despliegue en EC2 (puerto 80 con Nginx)

Comandos de prueba con `curl` desde la terminal local apuntando a la IP pública de EC2:

```bash
# Verificar estado del servicio
curl -i http://18.229.255.131/health

# Listar libros
curl -i http://18.229.255.131/libros

# Crear un libro
curl -i -X POST http://18.229.255.131/libros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Redes de Computadoras","autor":"Andrew S. Tanenbaum","anio_publicacion":2011}'

# Consultar un libro por ID
curl -i http://18.229.255.131/libros/4

# Actualizar un libro existente
curl -i -X PUT http://18.229.255.131/libros/4 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Redes de Computadoras (5ta Edicion)","autor":"Andrew S. Tanenbaum","anio_publicacion":2012}'

# Eliminar un libro
curl -i -X DELETE http://18.229.255.131/libros/3
```
