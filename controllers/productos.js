const { response } = require('express');
const Productos = require('../models/productos');


const getProductos = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const [ productos, total ] = await Promise.all([
        Productos
            .find({}, 'nombre serie precio descripcion estado fechacreacion')
            .skip( desde ),
            Productos.countDocuments()
    ]);

    res.json({
        ok: true,
        productos,
        total
    });
}

const crearProductos = async(req, res = response) => {

    try {

        const existenombre = await Productos.findOne({ nombre });
        if ( existenombre ) {
            return res.status(400).json({
                ok: false,
                msg: 'El nombre del producto ya está registrado'
            });
        }

        const existeserie = await Productos.findOne({ serie });
        if ( existeserie ) {
            return res.status(400).json({
                ok: false,
                msg: 'La serie del producto ya está registrado'
            });
        }

    const productos = new Productos( req.body );
    await productos.save();

    res.json({
        ok: true,
        productos
    });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const actualizarProductos = async (req, res = response) => {
    
    const uid = req.params.id;

    try {
        const productosDB = await Productos.findById( uid );
        if ( !productosDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el producto por ese id'
            });
        }
        // Actualizaciones
        
        const { nombre, serie, ...campos } = req.body;
        if ( productosDB.nombre !== nombre ) {
            const existeproducto = await Productos.findOne({ nombre });
            if ( existeproducto ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un producto con ese nombre'
                });
            }
        }
        if ( productosDB.serie !== serie ) {
            const existeserie = await Productos.findOne({ serie });
            if ( existeserie ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un producto con ese número de serie'
                });
            }
        }
        campos.nombre = nombre;
        const productoActualizado = await Productos.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            producto: productoActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarProductos = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const productosDB = await Productos.findById( uid );

        if ( !productosDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un producto por ese id'
            });
        }

        await Productos.findByIdAndDelete( uid );

        
        res.json({
            ok: true,
            msg: 'Producto eliminado'
        });

    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }
}

module.exports = {
    getProductos,
    crearProductos,
    actualizarProductos,
    borrarProductos
}