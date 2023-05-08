
const Role = require('../models/role');
const { User, Categoria, Producto } = require('../models');

const isRoleValid = async(role='') => {
    const existeRole = await Role.findOne({ role });
    if(!existeRole){
         throw new Error(`El role ${role} no existe en la Base de Datos`);
    }
}

const existeEmail = async (email='') => {
    const existeEmail = await User.findOne({email}); // El metodo findOne() es la funcion para buscar por email
    if(existeEmail){
        throw new Error(`El email ${ email } ya está registrado en nuestra Base de Datos`);
    }
} 
const existeUsuarioPorId = async (id) => {
    const existeUsuario = await User.findById(id); // El metodo findById() es la funcion MOngoDB para buscar por id
    if(!existeUsuario){
        throw new Error(`El id ${ id } no existe en la Base de Datos`);
    }
} 
const existeCategoriaPorId = async (id) => {
    
    const existeCategoria = await Categoria.findById(id); // El metodo findById() es la funcion MOngoDB para buscar por id
    
    if(!existeCategoria){
        throw new Error(`El id ${ id } no existe en la Base de Datos`);
    }
} 
/**
 * productos
 */
const existeProductoPorId = async (id) => {
    
    const existeProducto= await Producto.findById(id); // El metodo findById() es la funcion MOngoDB para buscar por id
    
    if(!existeProducto){
        throw new Error(`El id ${ id } no existe en la Base de Datos`);
    }
} 
/** 
 * validar colecciones permitidas 
 * */

const coleccionesPermitidas = (coleccion='', colecciones=[]) => {
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }
    return true;
}

module.exports = {
    isRoleValid,
    existeEmail,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}

