-- Base de datos para el segundo parcial de COM610
-- Luz Maria Muraña Mamani

CREATE DATABASE IF NOT EXISTS catalogo_libros_lmmm
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE catalogo_libros_lmmm;

CREATE TABLE IF NOT EXISTS libros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  autor VARCHAR(255) NOT NULL,
  anio_publicacion INT NOT NULL
);

INSERT INTO libros (titulo, autor, anio_publicacion) VALUES
  ('Cien años de soledad', 'Gabriel García Márquez', 1967),
  ('Clean Architecture', 'Robert C. Martin', 2017),
  ('El Señor de los Anillos', 'J. R. R. Tolkien', 1954);
