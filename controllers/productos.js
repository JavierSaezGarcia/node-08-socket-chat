const { response } = require("express");
const { Producto } = require("../models");


// TODO obtener categorias - paginado - total - populate
const obtenerProductos = async (req, res = response) => {

    const { limite = 10, desde = 0 } = req.query;
    const query = { state: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('user', 'name')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
}


// TODO obtener producto - populate {}
const obtenerProducto = async (req, res = response) => {   
    const { id } = req.params;
    const producto = await Producto.findById(id)
                            .populate('user', 'name');

    res.json(producto);
}

// TODO crear producto
const crearProducto = async (req, res= response) => {

    const  { state, user, ...body }  = req.body;

    const productoDB = await Producto.findOne({ name: body.name });
    if( productoDB ){
        return res.status(400).json({
            msg: `El producto ${productoDB.name} ya existe`
        });
    }
    // TODO generar la data a guardar
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id
        
    }
    // TODO le pasamos la data a guardar
    const producto = new Producto(data);
    
    // TODO guardar en la base de datos
    await producto.save();

   

    res.json({
        ok: true,
        producto
    });
}

// TODO actualizar producto

const actualizarProducto = async (req, res = response) => {    
    const { id } = req.params;    

    const { state, user, ...data } = req.body;
    if( data.name ){        
        data.name = data.name.toUpperCase();
    }
    
    data.user = req.user._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true, state: true });
   
    res.json(producto);
}

// TODO habilitar producto - estado: true
const habilitarProducto = async (req, res = response) => {
    const { id } = req.params;
    
    
    const productoHabilitado = await Producto.findByIdAndUpdate(id, { state: true }, { new: true });

    res.json(productoHabilitado);

}

// TODO borrar producto - estado: false

const borrarProducto = async (req, res = response) => {
    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, { state: false }, { new: true });

    res.json(productoBorrado);
}



module.exports = {

    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    habilitarProducto,
    borrarProducto

}