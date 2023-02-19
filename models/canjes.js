const { Schema, model } = require('mongoose');

const CanjesSchema = Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    fechadecanje: {
        type: String,
        required: true
    },
    sesiones:{
        type: Number,
        required:true
    },
    descripcion: {
        type: String,
        required: true
    },
    horario: {
        type: String,
        required: true
    },  
});


CanjesSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})



module.exports = model( 'Canjes', CanjesSchema );
