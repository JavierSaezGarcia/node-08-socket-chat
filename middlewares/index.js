const validarCampos   = require('../middlewares/validar-campos');
const validarJWT      = require('../middlewares/validar-jwt');
const validarRole     = require('../middlewares/validar-role');
const validarArchivo  = require('../middlewares/validar-archivo');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRole,
    ...validarArchivo
}