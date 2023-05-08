const { validationResult } = require("express-validator");

// Recuerda que un middleware no es mas que una funcion que se ejecuta
const validarCampos = async (req, res, next) => {
    const errors = validationResult(req); // Validamos los datos del body
    if(!errors.isEmpty()){ // si hay errores
        
        return await res.status(400).json({ // Retornamos el status 400 y los errores
            errors: errors.array()
        });
    }
    next(); // Si no hay errores, pasamos al siguiente middleware
}

module.exports = { // Exportamos los middlewares
    validarCampos
}