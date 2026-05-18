const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

/**
 * Controlador de autenticación.
 *
 * Este archivo contiene la lógica del inicio de sesión.
 * Su función principal es recibir usuario y contraseña,
 * validar la información contra la base de datos y devolver
 * el mensaje solicitado en la evidencia.
 */
const AuthController = {
    /**
     * Servicio de inicio de sesión.
     *
     * Ruta asociada:
     * POST /api/auth/login
     *
     * Respuestas solicitadas por el caso:
     * - Si los datos son correctos: "autenticación satisfactoria"
     * - Si los datos son incorrectos: "error de autenticación"
     */
    login: async (req, res) => {
        try {
            const { usuario, contrasena } = req.body;

            /**
             * Validación de campos obligatorios.
             * Si no se recibe usuario o contraseña, se responde
             * con error de autenticación según el caso planteado.
             */
            if (!usuario || !contrasena) {
                return res.status(401).json({
                    mensaje: 'error de autenticación'
                });
            }

            /**
             * Limpieza básica del nombre de usuario.
             * Se eliminan espacios innecesarios al inicio y al final.
             */
            const cleanUsername = usuario.trim();

            /**
             * Se busca el usuario en la base de datos.
             * Si no existe, no se permite el inicio de sesión.
             */
            const user = await UserModel.findByUsername(cleanUsername);

            if (!user) {
                return res.status(401).json({
                    mensaje: 'error de autenticación'
                });
            }

            /**
             * Comparación de contraseña.
             * Se compara la contraseña ingresada con la contraseña
             * cifrada almacenada en la base de datos.
             */
            const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);

            if (!isPasswordValid) {
                return res.status(401).json({
                    mensaje: 'error de autenticación'
                });
            }

            /**
             * Si el usuario existe y la contraseña coincide,
             * se responde con el mensaje requerido por la evidencia.
             */
            return res.status(200).json({
                mensaje: 'autenticación satisfactoria'
            });
        } catch (error) {
            console.error('Error en el inicio de sesión:', error.message);

            return res.status(500).json({
                mensaje: 'Error interno del servidor'
            });
        }
    }
};

module.exports = AuthController;