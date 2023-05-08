const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, esAdminRole } = require('../middlewares');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const { 
    obtenerProductos,
    obtenerProducto,
    crearProducto, 
    actualizarProducto,
    habilitarProducto,
    borrarProducto
    
} = require('../controllers/productos');


const router = Router();

// TODO obtener todas los Productos - publico
router.get('/',  obtenerProductos);

// TODO Crear producto - privado - cualquier persona con un token valido
router.post('/',  [ 
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),   
    check('categoria','No es una id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),   
    validarCampos
]
 ,crearProducto);

 // TODO obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto );

// TODO actualizar producto - privado - cualquier persona con un token valido
router.put('/:id',[
    validarJWT,      
    check('id').custom( existeProductoPorId ),
    validarCampos

], actualizarProducto);

// TODO habilitar PRODUCTO - privado - cualquier persona con un token valido
router.put('/ability/:id',[
    validarJWT,
    esAdminRole,   
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos     
    
] , habilitarProducto); 

// TODO delete producto - privado - cualquier persona con un token valido
router.delete('/:id',  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos

], borrarProducto);
   

 module.exports = router;