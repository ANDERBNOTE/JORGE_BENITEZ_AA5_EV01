const express = require('express');
const UserController = require('../controllers/userController');

/**
 * Rutas relacionadas con la gestión de usuarios.
 *
 * Este archivo utiliza express.Router para organizar los endpoints
 * asociados al registro de usuarios.
 */
const router = express.Router();
/**
 * Ruta para registrar un nuevo usuario.
 *
 * Método: POST
 * Endpoint final: /api/usuarios/registro
 *
 * Esta ruta recibe los datos básicos del usuario y delega
 * la lógica de registro al controlador UserController.
 */
router.post('/registro', UserController.register);
/**
 * Ruta para consultar todos los usuarios registrados.
 *
 * Esta ruta permite visualizar los usuarios almacenados en la base de datos
 * después de haber realizado registros mediante el método POST.
 *
 * Se usa principalmente para comprobar, desde Postman, que los datos
 * fueron guardados correctamente y que la API los entrega en formato JSON.
 *
 * No requiere enviar Body.
 *
 * La lógica de consulta se delega al método getAll
 * del controlador UserController.
 */
router.get('/', UserController.getAll);
module.exports = router;