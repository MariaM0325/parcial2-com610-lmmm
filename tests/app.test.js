const request = require('supertest');
const { createApp } = require('../src/app');
const db = require('../src/db');
const librosRepository = require('../src/librosRepository');

function crearRepositorioMock() {
  let datos = [];
  let secuenciaId = 1;

  const reset = () => {
    datos = [
      { id: 1, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', anio_publicacion: 1967 },
      { id: 2, titulo: 'Clean Architecture', autor: 'Robert C. Martin', anio_publicacion: 2017 }
    ];
    secuenciaId = 3;
  };

  reset();

  return {
    reset,
    async findAll() {
      return [...datos];
    },
    async findById(id) {
      return datos.find((l) => l.id === id) || null;
    },
    async create({ titulo, autor, anio_publicacion }) {
      const nuevo = { id: secuenciaId++, titulo, autor, anio_publicacion };
      datos.push(nuevo);
      return nuevo;
    },
    async update(id, { titulo, autor, anio_publicacion }) {
      const idx = datos.findIndex((l) => l.id === id);
      if (idx === -1) return null;
      datos[idx] = { id, titulo, autor, anio_publicacion };
      return datos[idx];
    },
    async remove(id) {
      const idx = datos.findIndex((l) => l.id === id);
      if (idx === -1) return false;
      datos.splice(idx, 1);
      return true;
    }
  };
}

describe('Pruebas de la API de libros', () => {
  const repoMock = crearRepositorioMock();
  const app = createApp(repoMock);

  beforeEach(() => {
    repoMock.reset();
  });

  test('GET /health responde 200 y confirma que el servicio esta activo', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('active', true);
  });

  test('GET /libros devuelve la lista de libros', async () => {
    const res = await request(app).get('/libros');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });

  test('GET /libros/:id devuelve un libro existente', async () => {
    const res = await request(app).get('/libros/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.titulo).toBe('Cien años de soledad');
  });

  test('GET /libros/:id responde 404 si el libro no existe', async () => {
    const res = await request(app).get('/libros/999');
    expect(res.statusCode).toBe(404);
  });

  test('GET /libros/:id responde 400 si el id no es numerico', async () => {
    const res = await request(app).get('/libros/abc');
    expect(res.statusCode).toBe(400);
  });

  test('POST /libros crea un libro valido y devuelve 201', async () => {
    const nuevo = {
      titulo: 'El Señor de los Anillos',
      autor: 'J. R. R. Tolkien',
      anio_publicacion: 1954
    };

    const res = await request(app).post('/libros').send(nuevo);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      id: 3,
      ...nuevo
    });
  });

  test('POST /libros rechaza con 400 datos invalidos (titulo o autor vacios, anio no entero)', async () => {
    const sinTitulo = await request(app).post('/libros').send({
      titulo: '',
      autor: 'Autor',
      anio_publicacion: 2020
    });
    expect(sinTitulo.statusCode).toBe(400);

    const sinAutor = await request(app).post('/libros').send({
      titulo: 'Libro',
      autor: '   ',
      anio_publicacion: 2020
    });
    expect(sinAutor.statusCode).toBe(400);

    const anioInvalido = await request(app).post('/libros').send({
      titulo: 'Libro',
      autor: 'Autor',
      anio_publicacion: 'texto'
    });
    expect(anioInvalido.statusCode).toBe(400);

    const anioDecimal = await request(app).post('/libros').send({
      titulo: 'Libro',
      autor: 'Autor',
      anio_publicacion: 2020.5
    });
    expect(anioDecimal.statusCode).toBe(400);
  });

  test('PUT /libros/:id actualiza un libro existente y responde 404 si no existe', async () => {
    const cambios = {
      titulo: 'Clean Architecture 2da Edicion',
      autor: 'Robert C. Martin',
      anio_publicacion: 2019
    };

    const resOk = await request(app).put('/libros/2').send(cambios);
    expect(resOk.statusCode).toBe(200);
    expect(resOk.body.titulo).toBe('Clean Architecture 2da Edicion');

    const res404 = await request(app).put('/libros/999').send(cambios);
    expect(res404.statusCode).toBe(404);
  });

  test('DELETE /libros/:id elimina un libro existente y responde 404 si no existe', async () => {
    const resOk = await request(app).delete('/libros/1');
    expect(resOk.statusCode).toBe(200);

    const res404 = await request(app).delete('/libros/1');
    expect(res404.statusCode).toBe(404);
  });
});

describe('Pruebas del repositorio SQL con mock de conexion', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('ejecuta consultas parametrizadas con ?', async () => {
    const spy = jest.spyOn(db, 'execute');

    spy.mockResolvedValueOnce([[{ id: 1, titulo: 'T', autor: 'A', anio_publicacion: 2000 }]]);
    await librosRepository.findAll();

    spy.mockResolvedValueOnce([[{ id: 1, titulo: 'T', autor: 'A', anio_publicacion: 2000 }]]);
    await librosRepository.findById(1);
    expect(spy).toHaveBeenLastCalledWith(
      'SELECT id, titulo, autor, anio_publicacion FROM libros WHERE id = ?',
      [1]
    );

    spy.mockResolvedValueOnce([{ insertId: 5 }]);
    await librosRepository.create({ titulo: 'Libro', autor: 'Autor', anio_publicacion: 2024 });
    expect(spy).toHaveBeenLastCalledWith(
      'INSERT INTO libros (titulo, autor, anio_publicacion) VALUES (?, ?, ?)',
      ['Libro', 'Autor', 2024]
    );
  });
});
