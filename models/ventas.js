const { Schema, model } = require('mongoose');

const ventasSchema = Schema({

    documento: {
        type: String,
        required: true,
        enum:['Factura','Boleta','Guia de Salida']
        },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
        },
    nombre:{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
        },
     subtotal:{
        type: Number,
        required:true
     },
     igv:{
        type: Number,
        required:true
     },
     total:{
        type: Number,
        required:true
     },
     moneda:{
        type: String,
        enum:['Soles','Dólares'],
        required:true
     },
     estado: {
        type: String,
        required: true,
        enum: ["1","0"],
        default:"1"
    },
    fecha: {
        type: Date.now(),
        required: true,
    },           
},
{
    collection:ventas
});


ventasSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})



module.exports = model( 'Ventas', ventasSchema );