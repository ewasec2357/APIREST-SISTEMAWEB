const { Schema, model } = require('mongoose');

const EspecialidadSchema = Schema({
    nombre: {
        type: String,
        required: true,
        unique:true
    },
    estado: {
        type: String,
        required: true,
        enum: ["1","0"],
        default:"1"
    },
}, {  collection: 'especialidades' });


EspecialidadSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})



module.exports = model( 'Especialidad', EspecialidadSchema );