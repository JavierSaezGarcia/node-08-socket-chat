const {Schema, model} = require('mongoose');
// Creamos el schema o modelo de mongoose que 
const userSchema = new Schema({
    name: {
        type:  String, // String es el tipo de dato y es la forma que mongoose va a guardarlo
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio'],
    },
    img: String, // solo con string porque es una url y sin llaves quedaria asi
    role: { 
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE','VENTAS_ROLE'] // enum es para definir los valores que puede tomar
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
    
                

});
// Sobreescribimos el metodo toJSON para que no retorne el password y usamos una funcion normal 
// porque vamos a usar el this para hacer referencia a la instancia creada
userSchema.methods.toJSON = function() {
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}
// Exportamos el modelo que lo llamaremos como User y le pasamos el schema que creamos arriba
module.exports = model('User', userSchema);