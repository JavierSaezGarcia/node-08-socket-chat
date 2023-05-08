const { response } = require("express");
const { User, Producto } = require("../models");
const { subirArchivo } = require("../helpers");
const fs = require('fs');
const path = require('path');

// Importamos el paquete para subir imagenes a cloudinary
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)




const cargarArchivo = async (req, res = response) => {

    
    try {
        //    const name = await subirArchivo(req.files, ['txt', 'md', 'pdf'], 'textos');
        // console.log(req.files)
        const name = await subirArchivo(req.files, undefined, 'images');
        res.json({ name });

    } catch (msg) {
        res.status(400).json({ msg });

    }



}
// Actualizar imagen  en local
const actualizarImagen = async (req, res = response) => {
   
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            });
    }

    // TODO limpiar imagenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);

    modelo.img = nombre;

    await modelo.save();

    res.json(modelo)
}

// Actualizar imagen en el cloud con cloudinary
const actualizarImagenCloudinary  = async (req, res = response) => {
   
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            });
    }

    // TODO limpiar imagenes previas
    if (modelo.img) {

        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);

    }
    const {tempFilePath} = req.files.archivo;


    const {secure_url} = await cloudinary.uploader.upload( tempFilePath)
    // const nombre = await subirArchivo(req.files, undefined, coleccion);

    modelo.img = secure_url;

    await modelo.save();

     res.json(modelo)
}


const mostrarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            });
    }

    // TODO limpiar imagenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg');  
    return res.sendFile(pathImagen);

   
}






module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}