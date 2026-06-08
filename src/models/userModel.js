const { pool } = require('../config/db');

/**
 * Modelo de usuario.
 *
 * Este archivo contiene las funciones encargadas de interactuar
 * directamente con la tabla usuarios en la base de datos MySQL.
 *
 * Aquí se centralizan las consultas SQL relacionadas con:
 * - Registro de usuarios.
 * - Búsqueda de usuarios para autenticación.
 * - Validación de usuarios duplicados.
 * - Consulta de usuarios registrados.
 *
 * Se utilizan consultas parametrizadas (?) para evitar inyección SQL.
 */
const UserModel = {
    /**
     * Crea un nuevo usuario en la base de datos.
     *
     * Esta función se utiliza cuando se realiza una petición POST
     * al endpoint de registro de usuario.
     *
     * @param {Object} userData - Datos del usuario a registrar.
     * @param {string} userData.nombre - Nombre del usuario.
     * @param {string} userData.apellidos - Apellidos del usuario.
     * @param {string} userData.correo - Correo electrónico del usuario.
     * @param {string} userData.usuario - Nombre de usuario para autenticación.
     * @param {string} userData.contrasena - Contraseña cifrada del usuario.
     * @returns {Object} Resultado de la operación INSERT.
     */
    createUser: async (userData) => {
        const sql = `
            INSERT INTO usuarios 
            (nombre, apellidos, correo, usuario, contrasena)
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            userData.nombre,
            userData.apellidos,
            userData.correo,
            userData.usuario,
            userData.contrasena
        ];

        const [result] = await pool.execute(sql, values);
        return result;
    },

    /**
     * Busca un usuario por su nombre de usuario.
     *
     * Esta función se utiliza en el proceso de inicio de sesión.
     * Permite validar si el usuario existe en la base de datos
     * y obtener su contraseña cifrada para compararla posteriormente.
     *
     * @param {string} usuario - Nombre de usuario ingresado en el login.
     * @returns {Object|null} Usuario encontrado o null si no existe.
     */
    findByUsername: async (usuario) => {
        const sql = `
            SELECT 
                id,
                nombre,
                apellidos,
                correo,
                usuario,
                contrasena,
                fecha_registro
            FROM usuarios
            WHERE usuario = ?
            LIMIT 1
        `;

        const [rows] = await pool.execute(sql, [usuario]);
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Busca si ya existe un usuario con el mismo correo o nombre de usuario.
     *
     * Esta función se utiliza antes de registrar un nuevo usuario.
     * Su objetivo es evitar registros duplicados en la base de datos,
     * teniendo en cuenta que los campos correo y usuario deben ser únicos.
     *
     * @param {string} correo - Correo electrónico a validar.
     * @param {string} usuario - Nombre de usuario a validar.
     * @returns {Object|null} Usuario encontrado o null si no existe.
     */
    findByEmailOrUsername: async (correo, usuario) => {
        const sql = `
            SELECT 
                id,
                correo,
                usuario
            FROM usuarios
            WHERE correo = ? OR usuario = ?
            LIMIT 1
        `;

        const [rows] = await pool.execute(sql, [correo, usuario]);
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Consulta todos los usuarios registrados en la base de datos.
     *
     * Esta función se utiliza para realizar una prueba GET desde Postman
     * y comprobar que los datos registrados previamente con el método POST
     * se están almacenando y entregando correctamente.
     *
     * Por seguridad, no se consulta ni se retorna el campo contrasena.
     *
     * Endpoint asociado sugerido:
     * GET /api/usuarios
     *
     * @returns {Array} Lista de usuarios registrados.
     */
    getAllUsers: async () => {
        const sql = `
            SELECT 
                id,
                nombre,
                apellidos,
                correo,
                usuario,
                fecha_registro
            FROM usuarios
            ORDER BY id DESC
        `;

        const [rows] = await pool.execute(sql);
        return rows;
    }
};

module.exports = UserModel;