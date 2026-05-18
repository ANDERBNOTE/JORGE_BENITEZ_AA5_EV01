const express = require('express');
const AuthController = require('../controllers/authController');

/**
 * Rutas relacionadas con la autenticación de usuarios.
 *
 * Este archivo utiliza express.Router para organizar los endpoints
 * asociados al inicio de sesión.
 */
const router = express.Router();

/**
 * Ruta para iniciar sesión.
 *
 * Método: POST
 * Endpoint final: /api/auth/login
 *
 * Esta ruta recibe usuario y contraseña, y delega la lógica
 * de autenticación al controlador AuthController.
 */
router.post('/login', AuthController.login);

module.exports = router;