

const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token'); // leer el token segun nuestras reglas que hayamos determinado

    
    // Si no recibimos el token en la peticion, devolvemos un error 401 (no autorizado) y un mensaje de error.     
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }

    try {
         // console.log(token);

        // const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);

        // console.log(payload);
        const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);
        // TODO Leer el usuario que se esta logueando con el uid anterior
        const userAuthenticated = await User.findById(uid);
        
        // TODO verificar si el usuario existe en la DB        
        if (!userAuthenticated) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no valido - usuario no existe en DB'
            });
        };
        // TODO verificar si el state esta en true
        if (!userAuthenticated.state) {
            return res.status(401).json({
                ok: false,
                msg: 'Token no valido - usuario con estado: false'
            });
        }

        req.user = userAuthenticated;        

        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        });
    }


}

module.exports = {
    validarJWT,
    userAuthenticated: true //Authenticado 
}