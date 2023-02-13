const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

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
    especialidad: {
        type: Array,
        items:{type:Schema.Types.ObjectId,
               uniqueItems:true},
        required: true,
        ref: 'Especialidad' 
    },
    nacimiento: {
        type: String,
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
        required: true
    },
    img: {
        type: String,
        required: true,
        default:"NO-IMG"
    },
    rol: {
        type: String,
        required: true,
        default: 'USUARIO_ROL'
    },
    estado: {
        type: String,
        required: true,
        enum: ["1","0"],
        default:"1"
    },
    esmedico:{
        type: Boolean,
        required: true,
        default: false
    }
}, 

{  collection: 'empleados' });


UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})



module.exports = model( 'Usuario', UsuarioSchema );
