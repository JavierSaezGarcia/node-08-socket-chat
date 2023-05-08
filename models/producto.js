const {Schema, model} = require('mongoose');
// Creamos el schema o modelo de mongoose que 
const productoSchema = new Schema({
    name:{
        type:String,
        required:[true, 'El nombre es obligatorio'],
        unique:true
    },
    state:{        
        type:Boolean,
        default:true,        
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',        
        required: true        
    },
    img: { 
        type:String
    },
    marca: {
        type: String,
        default:''
    },
    precio: {
        type:Number,
        default:0
    },
    categoria:{        
        type:Schema.Types.ObjectId,
        ref:'Categoria',
        required:true        
    },
    descripcion:{        
        type:String
    },
    disponible: {
        type: Boolean,
        default: true
    }
    
});
productoSchema.methods.toJSON = function() {
    const {__v, state, ...data} = this.toObject();
    
    return data;
}

module.exports = model('Producto', productoSchema);