// Importaciones
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, esAdminRole } = require('../middlewares');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { 
    crearCategoria, 
    obtenerCategorias, 
    obtenerCategoria, 
    actualizarCategoria, 
    habilitarCategoria,
    borrarCategoria
} = require('../controllers/categorias');


const router = Router();
/**
 *  {{ url }}/api/categorias
 */
// TODO obtener todas las categorias - publico
router.get('/',  obtenerCategorias);

// TODO obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], obtenerCategoria );

// TODO Crear categoria - privado - cualquier persona con un token valido
router.post('/',  [ 
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),    
    validarCampos
]
 ,crearCategoria);

// TODO actualizar categoria - privado - cualquier persona con un token valido
router.put('/:id',[
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos 
     
    
] , actualizarCategoria);

// TODO habilitar categoria - privado - cualquier persona con un token valido
router.put('/ability/:id',[
    validarJWT,
    esAdminRole,   
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos 
     
    
] , habilitarCategoria);

// TODO delete categoria - privado - Admin
router.delete('/:id',  [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos 

],borrarCategoria);


module.exports = router;