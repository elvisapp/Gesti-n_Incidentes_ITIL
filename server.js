const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*'
}));

// Configuración de la conexión MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Teamodios82$',
    database: 'gestion_incidentes',
    port: 3306,
});

// Conectar a MySQL
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
    } else {
        console.log('Conectado a MySQL');
    }
});

// Crear tabla de incidentes
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS incidentes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255),
        descripcion TEXT,
        estado VARCHAR(50)
    )
`;

db.query(createTableQuery, (err) => {
    if (err) {
        console.error('Error al crear la tabla:', err);
    } else {
        console.log('Tabla "incidentes" creada o ya existente');
    }
});

// Endpoints
app.get('/incidentes', (req, res) => {
    db.query('SELECT * FROM incidentes', (err, results) => {
        if (err) {
            console.error('Error al obtener incidentes:', err);
            return res.status(500).send('Error al obtener incidentes');
        }
        res.json(results);
    });
});

app.post('/incidentes', (req, res) => {
    const { titulo, descripcion, estado } = req.body;
    const query = 'INSERT INTO incidentes (titulo, descripcion, estado) VALUES (?, ?, ?)';
    db.query(query, [titulo, descripcion, estado], (err, result) => {
        if (err) {
            console.error('Error al crear incidente:', err);
            return res.status(500).send('Error al crear incidente');
        }
        res.status(201).json({ id: result.insertId });
    });
});

app.put('/incidentes/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, estado } = req.body;
    const query = 'UPDATE incidentes SET titulo = ?, descripcion = ?, estado = ? WHERE id = ?';
    db.query(query, [titulo, descripcion, estado, id], (err) => {
        if (err) {
            console.error('Error al actualizar incidente:', err);
            return res.status(500).send('Error al actualizar incidente');
        }
        res.send('Incidente actualizado correctamente');
    });
});

app.delete('/incidentes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM incidentes WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar incidente:', err);
            return res.status(500).send('Error al eliminar incidente');
        }
        res.send('Incidente eliminado correctamente');
    });
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
