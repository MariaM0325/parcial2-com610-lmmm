const express = require('express');
const defaultRepository = require('./librosRepository');

function validarLibro(body) {
  if (!body || typeof body !== 'object') {
    return { valido: false, error: 'Datos de entrada invalidos' };
  }

  const { titulo, autor, anio_publicacion } = body;

  if (typeof titulo !== 'string' || titulo.trim().length === 0) {
    return { valido: false, error: 'El titulo es obligatorio y no puede estar vacio' };
  }

  if (typeof autor !== 'string' || autor.trim().length === 0) {
    return { valido: false, error: 'El autor es obligatorio y no puede estar vacio' };
  }

  if (
    anio_publicacion === undefined ||
    anio_publicacion === null ||
    anio_publicacion === '' ||
    typeof anio_publicacion === 'boolean'
  ) {
    return { valido: false, error: 'El anio_publicacion debe ser un numero entero valido' };
  }

  const anioNumero =
    typeof anio_publicacion === 'number'
      ? anio_publicacion
      : Number(String(anio_publicacion).trim());

  if (!Number.isInteger(anioNumero) || anioNumero <= 0 || anioNumero > 3000) {
    return { valido: false, error: 'El anio_publicacion debe ser un numero entero valido' };
  }

  return {
    valido: true,
    datos: {
      titulo: titulo.trim(),
      autor: autor.trim(),
      anio_publicacion: anioNumero
    }
  };
}

function parseId(paramId) {
  if (!/^\d+$/.test(String(paramId))) {
    return null;
  }
  const id = Number(paramId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function createApp(repository = defaultRepository) {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      active: true,
      service: 'api-libros-lmmm',
      estudiante: 'Luz Maria Muraña Mamani',
      version: process.env.APP_VERSION || '2.0.0',
      timestamp: new Date().toISOString()
    });
  });

  app.get('/libros', async (req, res) => {
    try {
      const libros = await repository.findAll();
      return res.status(200).json(libros);
    } catch (error) {
      return res.status(500).json({ error: 'Error al consultar los libros' });
    }
  });

  app.get('/libros/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'ID invalido' });
    }

    try {
      const libro = await repository.findById(id);
      if (!libro) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }
      return res.status(200).json(libro);
    } catch (error) {
      return res.status(500).json({ error: 'Error al obtener el libro' });
    }
  });

  app.post('/libros', async (req, res) => {
    const validacion = validarLibro(req.body);
    if (!validacion.valido) {
      return res.status(400).json({ error: validacion.error });
    }

    try {
      const nuevoLibro = await repository.create(validacion.datos);
      return res.status(201).json(nuevoLibro);
    } catch (error) {
      return res.status(500).json({ error: 'Error al guardar el libro' });
    }
  });

  app.put('/libros/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'ID invalido' });
    }

    const validacion = validarLibro(req.body);
    if (!validacion.valido) {
      return res.status(400).json({ error: validacion.error });
    }

    try {
      const actualizado = await repository.update(id, validacion.datos);
      if (!actualizado) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }
      return res.status(200).json(actualizado);
    } catch (error) {
      return res.status(500).json({ error: 'Error al actualizar el libro' });
    }
  });

  app.delete('/libros/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'ID invalido' });
    }

    try {
      const eliminado = await repository.remove(id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }
      return res.status(200).json({ message: 'Libro eliminado', id });
    } catch (error) {
      return res.status(500).json({ error: 'Error al eliminar el libro' });
    }
  });

  return app;
}

const app = createApp();

module.exports = app;
module.exports.createApp = createApp;
module.exports.validarLibro = validarLibro;
