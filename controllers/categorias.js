const { response } = require("express");
const { Categoria } = require("../models");


// TODO obtener categorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {

    const { limite = 10, desde = 0 } = req.query;
    const query = { state: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('user', 'name')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });
}


// TODO obtener categoria - populate {}
const obtenerCategoria = async (req, res = response) => {   
    const { id } = req.params;
    const categoria = await Categoria.findById(id)
                            .populate('user', 'name');

    res.json(categoria);
}


const crearCategoria = async (req, res= response) => {
    const  name  = req.body.name.toUpperCase();

    const categoriaDB = await Categoria.findOne({name});
    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.name} ya existe`
        });
    }
    // TODO generar la data a guardar
    const data = {
        name,
        user: req.user._id
        
    }
    // TODO le pasamos la data a guardar
    const categoria = new Categoria(data);
    
    // TODO guardar en la base de datos
    await categoria.save();

    // res.status(201).json(categoria)

    res.json({
        ok: true,
        categoria
    });
}

// TODO actualizar categoria

const actualizarCategoria = async (req, res = response) => {    
    const { id } = req.params;
    

    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true, state: true });
   
    res.json(categoria);
}
// TODO habilitar categoria - estado: true
const habilitarCategoria = async (req, res = response) => {
    const { id } = req.params;
    

    
    const categoriaHabilitada = await Categoria.findByIdAndUpdate(id, { state: true }, { new: true });

    res.json(categoriaHabilitada);

}

// TODO borrar categoria - estado: false

const borrarCategoria = async (req, res = response) => {
    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { state: false }, { new: true });

    res.json(categoriaBorrada);
}



module.exports = {

    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    habilitarCategoria,
    borrarCategoria

}