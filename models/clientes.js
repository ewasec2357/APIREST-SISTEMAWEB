const { Schema, model } = require('mongoose');

const ClienteSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    genero: {
        type: String,
        required: true,
        enum:["Masculino","Femenino","Otros"]
    },
    dni: {
        type: String,
        unique:true,
        required: true
    },
    nacimiento: {
        type: Date,
        required: true
    },
    celular: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
        default:"NO-IMG"
    },
    rol: {
        type: String,
        required: true,
        default: "CLIENTE_ROL"
    },
    estado: {
        type: String,
        required: true,
        enum: ["1","0"],
        default:"1"
    },
});


ClienteSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})



module.exports = model( 'Cliente', ClienteSchema );
