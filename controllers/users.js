const { response, request } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const userGet = async (req = request, res = response) => {

    const { limite = 20, desde = 0 } = req.query;
    const query = { state: true }; // Limitamos los usuarios que queremos mostrar con estado true
    // const users = await User.find(query)
    // .skip(Number(desde))
    // .limit(Number(limite));

    // const totalRegistros = await User.countDocuments(query); // Con countDocuments() podemos contar los registros de la BD
    // Esta forma es para ejecutar los await de forma simultanea y que no se bloquee el flujo de ejecucion a parte de ganar milisegundos en dicha ejecucion.
    const [totalRegistrosLimited, totalRegistros, usuariosLimited, usuariosTotales ] = await Promise.all([
        User.countDocuments(query),
        User.countDocuments(),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
            User.find()
        
    ]);

    res.json({
        totalRegistrosLimited,
        totalRegistros,
        usuariosLimited,
        usuariosTotales
    });

    // res.json({
    //     totalRegistros,
    //     users
    // })




}

const userPost = async (req = request, res = response) => {


    const { name, email, password, role } = req.body; // Obtenemos los datos del body
    // Desestructuramos los datos del body
    // Creamos una instancia del modelo para usarlo en la base de datos
    const user = new User({ name, email, password, role });


    // TODO Encriptar la contraseña
    // genSaltSync()  es la funcion que nos permite generar un numero aleatorio de vueltas para encriptar la contraseña, 10 es un numero conveniente
    const salt = bcryptjs.genSaltSync();
    // Pasamos salt y el password para que encripte la contraseña como parametros
    user.password = bcryptjs.hashSync(password, salt); // hashsync es para encriptar la contraseña de una sola vía

    // Guardar en BD
    // const user = new User(body); // Pero esto solo, no lo grabaria en la BD, solo lo guardara en el objeto user
    await user.save(); // Guarda en la BD asincronamente
    res.json(user);
}
const userPut = async (req = request, res = response) => {
    const id = req.params.id;
    const { _id, password, google, ...resto } = req.body;
    if (password) {
        // TODO Encriptar la contraseña
        // genSaltSync()  es la funcion que nos permite generar un numero aleatorio de vueltas para encriptar la contraseña, 10 es un numero conveniente
        const salt = bcryptjs.genSaltSync(10);
        // Pasamos salt y el password para que encripte la contraseña como parametros
        resto.password = bcryptjs.hashSync(password, salt); // hashsync es para encriptar la contraseña de una sola vía
    }
    const user = await User.findByIdAndUpdate(id, resto);

    // TODO validar con la base de datos
    res.json(user);
};

const userDelete = async(req = request, res = response) => {
    const { id } = req.params;
    // Fisicamente lo borramos
    // const user = await User.findByIdAndDelete(id);
    
    // Otra forma mejor de borrarlo es ponerle el state a false
    const user = await User.findByIdAndUpdate(id, {state: false}, { new: true }); 
    // El new: true nos devuelve el user actualizado
    // Necesitamos para que funcione el metodo findByIdAndUpdate pasar un tercer parametro {new: true} para que el user este actualizado
    const userAuthenticated = req.user;
    
    res.json({
        
        user,
        userAuthenticated
    })
}


module.exports = {
    userGet,
    userPost,
    userPut,
    userDelete

};