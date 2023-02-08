const { response } = require('express');
const bcrypt = require('bcryptjs');

const Cliente = require('../models/clientes');
const { generarJWT } = require('../helpers/jwt');


const getClientes = async(req, res) => {

    const desde = Number(req.query.desde) || 0;

    const [ clientes, total ] = await Promise.all([
        Cliente
            .find({}, 'nombre apellido genero dni cumpleaños celular email img role')
            .skip( desde ),

        Cliente.countDocuments()
    ]);


    res.json({
        ok: true,
        clientes,
        total
    });

}

const crearCliente = async(req, res = response) => {

    const { email, contraseña, dni } = req.body;

    try {

        const existeEmail = await Cliente.findOne({ email });

        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const existedni = await Cliente.findOne({ dni });

        if ( existedni ) {
            return res.status(400).json({
                ok: false,
                msg: 'El dni ya está registrado'
            });
        }

        const cliente = new Cliente( req.body );
    
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        cliente.contraseña = bcrypt.hashSync( contraseña, salt );
    
    
        // Guardar usuario
        await cliente.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT( cliente.id );


        res.json({
            ok: true,
            cliente,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }


}


const actualizarCliente = async (req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;


    try {

        const usuarioDB = await Usuario.findById( uid );
        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }
        // Actualizaciones
        const { password, google, email, ...campos } = req.body;
        if ( usuarioDB.email !== email ) {
            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}


const borrarCliente = async(req, res = response ) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        
        res.json({
            ok: true,
            msg: 'Usuario eliminado'
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
    getClientes,
    crearCliente,
    actualizarCliente,
    borrarCliente
}