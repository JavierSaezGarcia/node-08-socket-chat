const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { User, Categoria, Producto } = require("../models");

coleccionesPermitidas = [
    'users',
    'categorias',
    'productos',
    'roles'
];


const buscarUsuarios = async(termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); // TRUE

    if(esMongoID){
        const user = await User.findById(termino);
        return res.json({
            results: (user) ? [user] : []
        });
    }

    const regex = new RegExp(termino, 'i'); // esto hace que sea insensible a las mayusculas y busca el termino que se escribió


    const users = await User.find({
        $or: [{name: regex}, {email: regex}], // Con $or se puede hacer un OR que es una opcion u otra
        $and: [{state: true}] // y con $and abliga a las dos opciones a incluir state en true
    });

    res.json({
        results: users
    });




}

const buscarCategorias = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino); // TRUE

    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }
    
    const regex = new RegExp(termino, 'i'); // esto hace que sea insensible a las mayusculas y busca el termino que se escribió


    const categorias = await Categoria.find({
       name: regex, state: true
       
    });

    res.json({
        results: categorias
    });




}

const buscarProductos = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino); // TRUE

    if(esMongoID){
        const producto = await Producto.findById(termino).populate('categoria', 'name').populate('user', 'name')
        return res.json({
            results: (producto) ? [producto] : []
        });
    }    
    const regex = new RegExp(termino, 'i'); // esto hace que sea insensible a las mayusculas y busca el termino que se escribió

    const productos = await Producto.find({
        $or: [{name: regex}, {marca: regex}],
        $and: [{state: true}]
    }).populate('categoria', 'name')
      .populate('user', 'name')


    res.json({ 
        results: productos
    });
}


const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    } 

    switch (coleccion) {
        case 'users':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;        
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda' 
            })
            
    }

    


}

    


module.exports = buscar;