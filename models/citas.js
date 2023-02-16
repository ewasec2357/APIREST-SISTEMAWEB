const { Schema, model } = require('mongoose');

const CitasSchema = Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    especialidad: {
        type: Schema.Types.ObjectId,
        ref: 'Especialidad',
        required: true
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    horario: {
        type: Date,
        required: true
    },  
});


CitasSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})



module.exports = model( 'Citas', CitasSchema );
