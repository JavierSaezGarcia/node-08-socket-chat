const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '30d'
            // expiresIn: '365d'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                console.log(token);
                resolve(token);
            }
        });
    })
}

module.exports = {
    generarJWT
}