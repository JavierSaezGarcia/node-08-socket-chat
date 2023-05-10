const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


// definimos el controlador login
const login = async(req = request, res= response) => {
    const { email, password } = req.body;
    
    try {
        
        // TODO verificar si el email existe
        const user = await User.findOne({email});
        if(!user){  
            return res.status(400).json({
                msg:"El usuario no existe - email"
            })
        }


        // TODO verificar si el usuario esta activo
        const isActive = user.state;
        if(!isActive){
             return res.status(400).json({
                msg:"El usuario no esta activo - estado: false"
            })
        }


        // TODO verificar el password
        // SINCRONA
        const validPassword = bcryptjs.compareSync(password, user.password); // bcryptjs tiene un metodo para comparar passwords pero no es una funcion asincrona ¡cuidado!
        if(!validPassword){ 
            return res.status(400).json({
                msg:"El password no es valido"
            })
        }   

        // TODO generar el JWT
        const token = await generarJWT(user.id);
        // console.log('mi token:    ',token);

        // TODO enviar el token
        res.json({
            msg: 'Login ok',
            user,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            msg:"Hable con el administrador"
        })
    }
    
}

const googleSignin = async(req, res= response) => {

    const { id_token } = req.body;
    // console.log('mi token                          ',id_token)
    
    try {
        // const googleUser = await googleVerify(id_token);
        // console.log(google.user)
        
        const { name, img, email } = await googleVerify(id_token);
        
        // TODO verificar si el usuario existe
        let user = await User.findOne({email});
         // console.log(user)
        // TODO si el usuario no existe
        if(!user){
             console.log('no hay user...',user)
            const data = {
                name,
                email,
                password: ':P',
                img,
                role: 'USER_ROLE',                
                google: true, 
            }
            user = new User(data);
            
            await user.save();
            
        }
        
        // TODO si el usuario en DB no esta activo
        if(!user.state){
            console.log('este usuario no esta activo',user)
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            })
        }
        // TODO generar el JWT
        const token = await generarJWT(user.id);
        
        
     
        res.json({
            user,
            token
        })
        
    } catch (error) {
        res.status(400).json({ 
           
            msg:'Token de google no es valido'
            
        })
        
    }    

}


const renovarToken = async(req, res= response) => {
    const { user } = req;
        
    const token = await generarJWT(user.id);
    res.json({
        user,
        token
    })
}


module.exports = {
    login,
    googleSignin,
    renovarToken

}