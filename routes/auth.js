const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


//Crear usuario
router.post('/new', [
    check('name', 'El campo nombre no puede estar vacio y debe tener al menos 3 caracteres')
        .not().isEmpty(),
    check('email', 'El campo de email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isString(),
    validarCampos,
],crearUsuario)



//Login de usuario
router.post('/', [
    check('email', 'El campo de email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isString(),
    validarCampos,
],loginUsuario)


//renovar token de usuario
router.get('/renew', validarJWT ,revalidarToken)


module.exports = router
