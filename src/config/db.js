const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Configuración del pool de conexiones a MySQL.
 * 
 * Se usa createPool porque permite reutilizar conexiones
 * y mejora el rendimiento frente a crear una conexión nueva
 * por cada solicitud.
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * Función para validar la conexión con la base de datos.
 * Se ejecuta al iniciar el servidor para confirmar que MySQL responde.
 */
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión exitosa a la base de datos MySQL');
        connection.release();
    } catch (error) {
        console.error('Error al conectar con la base de datos MySQL:', error.message);
    }
};

module.exports = {
    pool,
    testConnection
};