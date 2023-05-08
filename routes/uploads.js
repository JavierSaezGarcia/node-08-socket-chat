const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivo } = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen , actualizarImagenCloudinary} = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

// Ruta cargar archivos
router.post('/', 
  validarArchivo, 
  cargarArchivo
  );

// Ruta actualizar imagen
router.put('/:coleccion/:id', [
    validarArchivo ,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['users', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);
//],actualizarImagen);

// Ruta solicitar un producto
router.get('/:coleccion/:id', [
  check('id', 'El id debe ser de mongo').isMongoId(),
  check('coleccion').custom(c => coleccionesPermitidas(c, ['users', 'productos'])),
  validarCampos
], mostrarImagen);



module.exports = router;