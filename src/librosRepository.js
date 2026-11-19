const db = require('./db');

const librosRepository = {
  async findAll() {
    const [rows] = await db.execute(
      'SELECT id, titulo, autor, anio_publicacion FROM libros ORDER BY id ASC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.execute(
      'SELECT id, titulo, autor, anio_publicacion FROM libros WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ titulo, autor, anio_publicacion }) {
    const [result] = await db.execute(
      'INSERT INTO libros (titulo, autor, anio_publicacion) VALUES (?, ?, ?)',
      [titulo, autor, anio_publicacion]
    );
    return {
      id: result.insertId,
      titulo,
      autor,
      anio_publicacion
    };
  },

  async update(id, { titulo, autor, anio_publicacion }) {
    const [result] = await db.execute(
      'UPDATE libros SET titulo = ?, autor = ?, anio_publicacion = ? WHERE id = ?',
      [titulo, autor, anio_publicacion, id]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return {
      id,
      titulo,
      autor,
      anio_publicacion
    };
  },

  async remove(id) {
    const [result] = await db.execute(
      'DELETE FROM libros WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = librosRepository;
