const { response } = require('express');
const bcrypt = require('bcryptjs');

const Cliente = require('../models/clientes');
const { generarJWT } = require('../helpers/jwt');


const getClientes = async(req, res) => {

    const desde = Number(req.query.desde) || 0;

    const [ clientes, total ] = await Promise.all([
        Cliente
            .find({}, 'nombre apellido genero dni cumpleaños celular email img rol')
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

        const clienteDB = await Cliente.findById( uid );
        if ( !clienteDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un cliente por ese id'
            });
        }
        // Actualizaciones
        const { contraseña, email, dni, ...campos } = req.body;
       //VALIDACION CORREO NO PUEDE SER IGUAL A UNO DE LA BD 
        if ( clienteDB.email !== email ) {
            const existeEmail = await Cliente.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un cliente con ese email'
                });
            }
        }
        //VALIDACION DNI NO PUEDE SER IGUAL A UNO DE LA BD 
        if ( clienteDB.dni !== dni ) {
            const existeDni = await Cliente.findOne({ dni });
            if ( existeDni ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un cliente con ese dni'
                });
            }
        }

        campos.email = email;
        campos.dni = dni;

        const clienteActualizado = await Cliente.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: clienteActualizado
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

        const clienteDB = await Cliente.findById( uid );

        if ( !clienteDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un cliente por ese id'
            });
        }

        await Cliente.findByIdAndDelete( uid );

        
        res.json({
            ok: true,
            msg: 'Cliente eliminado'
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