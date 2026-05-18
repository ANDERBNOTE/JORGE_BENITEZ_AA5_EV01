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

module.exports = router;