import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors()); 
app.use(express.json());

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'TiendaGaming',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ruta para obtener productos
app.get('/api/productos', (req, res) => {
  const query = `
    SELECT p.producto_id, p.nombre, p.descripcion, p.precio, p.stock, c.nombre AS categoria, p.tipo, p.imagen_url, p.trailer_url
    FROM productos p
    LEFT JOIN categorias c ON p.categoria_id = c.categoria_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
    res.json(results);
  });
});

// Ruta raíz para testear el servidor
app.get('/', (req, res) => {
  res.send('¡Servidor de Pixelplay funcionando!');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


