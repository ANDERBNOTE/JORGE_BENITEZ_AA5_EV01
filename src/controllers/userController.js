const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

/**
 * Controlador de usuarios.
 *
 * Este archivo contiene la lógica relacionada con el registro
 * de usuarios dentro del sistema.
 */
const UserController = {
    /**
     * Registra un nuevo usuario en la base de datos.
     *
     * Este método recibe los datos enviados desde el cliente,
     * valida que estén completos, cifra la contraseña y luego
     * solicita al modelo que guarde la información en MySQL.
     *
     * Ruta asociada:
     * POST /api/usuarios/registro
     */
    register: async (req, res) => {
        try {
            const { nombre, apellidos, correo, usuario, contrasena } = req.body;

            /**
             * Validación de campos obligatorios.
             * Si algún campo no llega en la solicitud, se devuelve
             * una respuesta de error al cliente.
             */
            if (!nombre || !apellidos || !correo || !usuario || !contrasena) {
                return res.status(400).json({
                    mensaje: 'Todos los campos son obligatorios'
                });
            }

            /**
             * Limpieza básica de datos.
             * Se eliminan espacios al inicio y al final para evitar
             * registros inconsistentes en la base de datos.
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
             */
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(cleanUserData.correo)) {
                return res.status(400).json({
                    mensaje: 'El correo electrónico no tiene un formato válido'
                });
            }

            /**
             * Se valida si ya existe un usuario con el mismo correo
             * o nombre de usuario, para evitar duplicados.
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
             * Por buenas prácticas de seguridad, no se guarda la contraseña
             * en texto plano dentro de la base de datos.
             */
            const hashedPassword = await bcrypt.hash(cleanUserData.contrasena, 10);

            /**
             * Objeto final que será enviado al modelo para registrar
             * el usuario en la tabla usuarios.
             */
            const userData = {
                nombre: cleanUserData.nombre,
                apellidos: cleanUserData.apellidos,
                correo: cleanUserData.correo,
                usuario: cleanUserData.usuario,
                contrasena: hashedPassword
            };

            const result = await UserModel.createUser(userData);

            return res.status(201).json({
                mensaje: 'usuario registrado satisfactoriamente',
                id_usuario: result.insertId
            });
        } catch (error) {
            console.error('Error en el registro de usuario:', error.message);

            return res.status(500).json({
                mensaje: 'Error interno del servidor'
            });
        }
    }
};

module.exports = UserController;