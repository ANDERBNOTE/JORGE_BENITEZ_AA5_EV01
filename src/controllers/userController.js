const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

/**
 * Controlador de usuarios.
 *
 * Este archivo contiene la lógica relacionada con las operaciones
 * principales de los usuarios dentro del sistema.
 *
 * Funciones incluidas:
 * - Registrar un nuevo usuario.
 * - Consultar los usuarios registrados.
 *
 * El controlador recibe las solicitudes HTTP, valida la información,
 * llama al modelo correspondiente y devuelve una respuesta JSON al cliente.
 */
const UserController = {
    /**
     * Registra un nuevo usuario en la base de datos.
     *
     * Este método recibe los datos enviados desde el cliente,
     * valida que estén completos, limpia la información básica,
     * verifica que no exista un usuario duplicado, cifra la contraseña
     * y solicita al modelo que guarde la información en MySQL.
     *
     * Ruta asociada:
     * POST /api/usuarios/registro
     */
    register: async (req, res) => {
        try {
            const { nombre, apellidos, correo, usuario, contrasena } = req.body;

            /**
             * Validación de campos obligatorios.
             *
             * Si alguno de los campos requeridos no llega en la solicitud,
             * la API responde con estado 400 Bad Request.
             */
            if (!nombre || !apellidos || !correo || !usuario || !contrasena) {
                return res.status(400).json({
                    mensaje: 'Todos los campos son obligatorios'
                });
            }

            /**
             * Limpieza básica de datos.
             *
             * Se eliminan espacios al inicio y al final para evitar
             * registros inconsistentes en la base de datos.
             *
             * El correo se convierte a minúsculas para evitar duplicados
             * por diferencias de mayúsculas y minúsculas.
             */
            const cleanUserData = {
                nombre: nombre.trim(),
                apellidos: apellidos.trim(),
                correo: correo.trim().toLowerCase(),
                usuario: usuario.trim(),
                contrasena
            };

            /**
             * Validación básica del formato de correo electrónico.
             *
             * Esta expresión regular verifica que el correo tenga una
             * estructura mínima válida, por ejemplo: usuario@dominio.com
             */
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(cleanUserData.correo)) {
                return res.status(400).json({
                    mensaje: 'El correo electrónico no tiene un formato válido'
                });
            }

            /**
             * Validación de usuario duplicado.
             *
             * Antes de registrar el usuario, se consulta si ya existe
             * un registro con el mismo correo o con el mismo nombre de usuario.
             *
             * Si existe, se responde con estado 409 Conflict.
             */
            const existingUser = await UserModel.findByEmailOrUsername(
                cleanUserData.correo,
                cleanUserData.usuario
            );

            if (existingUser) {
                return res.status(409).json({
                    mensaje: 'El correo o usuario ya se encuentra registrado'
                });
            }

            /**
             * Cifrado de la contraseña.
             *
             * Por buenas prácticas de seguridad, la contraseña no se guarda
             * en texto plano dentro de la base de datos.
             *
             * bcrypt.hash recibe la contraseña y el número de rondas de cifrado.
             */
            const hashedPassword = await bcrypt.hash(cleanUserData.contrasena, 10);

            /**
             * Objeto final que será enviado al modelo.
             *
             * Aquí se reemplaza la contraseña original por la contraseña cifrada.
             */
            const userData = {
                nombre: cleanUserData.nombre,
                apellidos: cleanUserData.apellidos,
                correo: cleanUserData.correo,
                usuario: cleanUserData.usuario,
                contrasena: hashedPassword
            };

            /**
             * Registro del usuario en la base de datos.
             *
             * Se llama al modelo UserModel.createUser(), que ejecuta
             * la sentencia INSERT en MySQL.
             */
            const result = await UserModel.createUser(userData);

            /**
             * Respuesta exitosa.
             *
             * Se devuelve estado 201 Created porque se creó un nuevo recurso.
             */
            return res.status(201).json({
                mensaje: 'usuario registrado satisfactoriamente',
                id_usuario: result.insertId
            });
        } catch (error) {
            /**
             * Manejo de errores internos.
             *
             * Si ocurre un error inesperado durante el registro,
             * se muestra el error en consola y se responde con estado 500.
             */
            console.error('Error en el registro de usuario:', error.message);

            return res.status(500).json({
                mensaje: 'Error interno del servidor'
            });
        }
    },

    /**
     * Consulta todos los usuarios registrados en la base de datos.
     *
     * Este método permite realizar una prueba GET desde Postman
     * para comprobar que los datos registrados mediante el método POST
     * fueron almacenados correctamente y pueden ser entregados por la API.
     *
     * Ruta asociada:
     * GET /api/usuarios
          */
    getAll: async (req, res) => {
        try {
            /**
             * Consulta de usuarios.
             *
             * Se llama al modelo UserModel.getAllUsers(), que ejecuta
             * la consulta SELECT en la tabla usuarios.
             */
            const users = await UserModel.getAllUsers();

            /**
             * Respuesta exitosa.
             *
             * Se devuelve estado 200 OK junto con:
             * - Mensaje de confirmación.
             * - Total de usuarios encontrados.
             * - Arreglo con los datos de los usuarios.
             */
            return res.status(200).json({
                mensaje: 'usuarios consultados correctamente',
                total: users.length,
                data: users
            });
        } catch (error) {
            /**
             * Manejo de errores internos.
             *
             * Si ocurre un error al consultar los usuarios,
             * se muestra en consola y se responde con estado 500.
             */
            console.error('Error al consultar usuarios:', error.message);

            return res.status(500).json({
                mensaje: 'Error interno del servidor'
            });
        }
    }
};

module.exports = UserController;