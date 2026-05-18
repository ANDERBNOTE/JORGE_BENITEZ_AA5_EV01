const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

/**
 * Archivo principal de la aplicación.
 *
 * En este archivo se configura el servidor Express,
 * los middlewares, las rutas principales de la API
 * y la conexión con la base de datos MySQL.
 */

// Se crea una instancia de la aplicación Express.
const app = express();

/**
 * Configuración de middlewares.
 *
 * cors permite que otros clientes puedan consumir la API.
 * express.json permite recibir datos en formato JSON desde el cliente.
 */
app.use(cors());
app.use(express.json());

/**
 * Ruta principal de prueba.
 *
 * Permite validar desde el navegador o Postman que
 * el servidor está funcionando correctamente.
 */
app.get('/', (req, res) => {
    res.status(200).json({
        mensaje: 'API REST funcionando correctamente - GA7-220501096-AA5-EV01'
    });
});

/**
 * Rutas principales de la API.
 *
 * /api/usuarios contiene el servicio de registro.
 * /api/auth contiene el servicio de inicio de sesión.
 */
app.use('/api/usuarios', userRoutes);
app.use('/api/auth', authRoutes);

/**
 * Middleware para manejar rutas no encontradas.
 *
 * Si el cliente consulta una ruta que no existe,
 * se devuelve un mensaje controlado.
 */
app.use((req, res) => {
    res.status(404).json({
        mensaje: 'Ruta no encontrada'
    });
});

/**
 * Configuración del puerto del servidor.
 *
 * Se toma el puerto desde el archivo .env.
 * Si no existe, se usa el puerto 3000 por defecto.
 */
const PORT = process.env.PORT || 3000;

/**
 * Inicio del servidor.
 *
 * Antes de dejar el servidor activo, se valida la conexión
 * con la base de datos MySQL.
 */
app.listen(PORT, async () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    await testConnection();
});