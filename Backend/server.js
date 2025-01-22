const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Rutas para arboles binarios
app.get('/api/binary-trees', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data/binaryTrees.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los datos de árboles binarios' });
    }
});

app.post('/api/binary-trees', async (req, res) => {
    try {
        const data = req.body;
        await fs.writeFile(
            path.join(__dirname, 'data/binaryTrees.json'),
            JSON.stringify(data, null, 2)
        );
        res.json({ message: 'Datos guardados exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar los datos de árboles binarios' });
    }
});

// para rutas optimas
app.get('/api/optimal-routes', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data/optimalRoutes.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los datos de rutas óptimas' });
    }
});

app.post('/api/optimal-routes', async (req, res) => {
    try {
        const data = req.body;
        await fs.writeFile(
            path.join(__dirname, 'data/optimalRoutes.json'),
            JSON.stringify(data, null, 2)
        );
        res.json({ message: 'Datos guardados exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar los datos de rutas óptimas' });
    }
});

// para el de la mochila
app.get('/api/knapsack', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data/knapsack.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los datos del problema de la mochila' });
    }
});

app.post('/api/knapsack', async (req, res) => {
    try {
        const data = req.body;
        await fs.writeFile(
            path.join(__dirname, 'data/knapsack.json'),
            JSON.stringify(data, null, 2)
        );
        res.json({ message: 'Datos guardados exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar los datos del problema de la mochila' });
    }
});

// para series
app.get('/api/sports-series', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data/sportsSeries.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los datos de series deportivas' });
    }
});

app.post('/api/sports-series', async (req, res) => {
    try {
        const data = req.body;
        await fs.writeFile(
            path.join(__dirname, 'data/sportsSeries.json'),
            JSON.stringify(data, null, 2)
        );
        res.json({ message: 'Datos guardados exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar los datos de series deportivas' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});