const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignin } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// POST
router.post('/login',[
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login); // 3.- definimos la ruta post y la funcion de login

router.post('/google',[
    check('id_token', 'El id_token de Google es necesario').not().isEmpty(),    
    validarCampos
], googleSignin); // 3.- definimos la ruta post y la funcion de googleSignIn

module.exports = router;