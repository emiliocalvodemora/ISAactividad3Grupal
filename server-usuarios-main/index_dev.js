const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const SECRET = require("./secret").secret; // Cambia esto en producción

const app = express();
app.use(express.json());
app.use(cors());

// Inicializa la base de datos SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite');
        console.log('Creando la tabla de usuarios si no existe...');
        db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('Creando la tabla de comentarios si no existe...');
        db.run(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        station_id TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        username TEXT NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    }
});

// Registro de usuario
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });

    db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], async (err, row) => {
        if (row) return res.status(409).json({ message: 'Usuario o email ya existe' });

        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            function (err) {
                if (err) return res.status(500).json({ message: 'Error en el servidor', error: err.message });
                res.status(201).json({ message: 'Usuario registrado correctamente' });
            }
        );
    });
});

// Login de usuario
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (!user) return res.status(401).json({ message: 'Credenciales incorrectas' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Credenciales incorrectas' });

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login correcto', token, username: user.username });
    });
});

// Añadir comentario
app.post('/api/comments', (req, res) => {
    const { token, station_id, comment } = req.body;
    if (!token || !station_id || !comment) return res.status(400).json({ message: 'Datos incompletos' });

    let payload;
    try {
        payload = jwt.verify(token, SECRET);
    } catch {
        return res.status(401).json({ message: 'Token inválido' });
    }

    db.run(
        'INSERT INTO comments (station_id, user_id, username, comment) VALUES (?, ?, ?, ?)',
        [station_id, payload.id, payload.username, comment],
        function (err) {
            if (err) return res.status(500).json({ message: 'Error al guardar comentario', error: err.message });
            res.status(201).json({ message: 'Comentario guardado' });
        }
    );
});

// Obtener comentarios de una estación
app.get('/api/comments/:station_id', (req, res) => {
    db.all(
        'SELECT username, comment, created_at FROM comments WHERE station_id = ? ORDER BY created_at DESC',
        [req.params.station_id],
        (err, rows) => {
            if (err) return res.status(500).json({ message: 'Error al obtener comentarios', error: err.message });
            res.json(rows);
        }
    );
});

app.listen(4000, () => console.log('Servidor backend (SQLite) en http://localhost:4000'));