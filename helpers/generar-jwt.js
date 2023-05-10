const jwt = require('jsonwebtoken');
const {User} = require('../models');

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
                // console.log(token);
                resolve(token);
            }
        });
    })
}

const comprobarJWT = async(token = '') => {
    try {
        if( token.length < 10 ) {
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);
        const user = await User.findById(uid);

        

        if( user ) {
            if(user.state){
                return user;
            }else{
                return null;
            }
            
        }else{
            return null;
        
        }

    } catch (error) {
        return null;
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}