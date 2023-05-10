const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();
// Manejador de Sockets
const socketController = async(socket = new Socket(), io) => {


    // console.log('cliente conectado id: ', socket.id);
    
    const user = await comprobarJWT(socket.handshake.headers['x-token']);
    
    if (!user) {
        return socket.disconnect();
    }
    // Agregar un usuario a la conexion
    chatMensajes.conectarUsuario(user);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    // Conectarlo a una sala especifica para mensajes privados
    socket.join(user.id); // Ahora tendremos tres salas: Global, privada(socket.id) y privada de un usuario(user.id)

    // Limpiar cuando un usuario se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(user.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    socket.on('enviar-mensaje', ({uid,mensaje}) => {
        if(uid){
            // Mensaje privado
            socket.to(uid).emit('mensaje-privado', {de: user.name, mensaje}); // Para enviar a un usuario
        }else{
            // Mensaje global
            chatMensajes.enviarMensaje(user.id , user.name, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }        
    
       
    })

   

}

module.exports = {
    socketController
}
