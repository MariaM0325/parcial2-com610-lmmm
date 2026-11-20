# Evidencias del Segundo Parcial

Capturas de verificación de los dos ejercicios:

## Ejercicio 1: API REST en EC2 con base de datos RDS

1. **Instancia EC2 y reglas de seguridad (`secgroup-ec2-lmmm`):**
   ![EC2 y Grupo de Seguridad](./01-ec2-instancia-y-sg.jpg)

2. **Instancia RDS privada (`rds-libros-lmmm`) y regla del puerto 3306 desde EC2:**
   ![RDS Disponible y Privado](./02a-rds-disponible-privado.jpg)
   ![RDS vinculado al SG de EC2](./02b-rds-regla-sg-ec2.jpg)
   ![Regla de entrada MySQL 3306](./02c-sg-rds-mysql-3306.jpg)

3. **Verificación de endpoints publicados con Nginx en puerto 80 y datos en RDS:**
   ![Endpoint Health](./03a-api-health-nginx.png)
   ![Listado de libros desde RDS](./03b-api-libros-rds.png)
   ![Consulta de libro por ID](./03c-api-libro-por-id.png)
   ![Respuesta 404 libro inexistente](./03d-api-libro-404.png)

## Ejercicio 2: CI/CD con GitHub Actions y Docker

4. **Ejecución de pruebas automatizadas en el workflow de CI (`ci.yml`):**
   ![Workflow CI exitoso](./04a-ci-workflow-exitoso.jpg)
   ![Detalle de pasos npm ci y npm test](./04b-ci-detalle-pruebas.jpg)

5. **Contenedor local en Docker Desktop, Secrets de GitHub y publicación en Docker Hub con SHA:**
   ![Contenedor en Docker Desktop](./05a-docker-desktop-local.jpg)
   ![Secrets configurados en GitHub](./05b-github-secrets.jpg)
   ![Imagen publicada en Docker Hub con SHA](./05c-dockerhub-imagen-sha.jpg)

6. **Despliegue automático en EC2 (`cd.yml`) y cambio visible de versión en `/health`:**
   ![Pipeline CD completo](./06a-cd-pipeline-despliegue.jpg)
   ![Respuesta de /health con version 2.0.0](./06b-api-health-version-2.0.0.png)
