const { Schema, model } = require('mongoose');

const ProductosSchema = Schema({
    nombre: {
        type: String,
        required: true,
        unique:true
    },
    serie:{
        type: Number,
        required: true,
        unique: true
    },
    precio:{
        type: Number,
        required: true
    },
    descripcion:{
        type: String,
        default:'PRODUCTO'
    },
    estado: {
        type: String,
        required: true,
        enum: ["1","0"],
        default:"1"
    },
    fechacreacion:{
        type: Date.now().toString(),
        required: true
    }
}, {  collection: 'productos' });


ProductosSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model( 'Productos', ProductosSchema );