const {Schema, model} = require('mongoose');
// Creamos el schema o modelo de mongoose que 
const categoriaSchema = new Schema({
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
    }
    
});
categoriaSchema.methods.toJSON = function() {
    const {__v, state, ...data} = this.toObject();
    
    return data;
}

module.exports = model('Categoria', categoriaSchema);
