const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async(req, res) => {

    const desde = Number(req.query.desde) || 0;

    const [ usuarios, total ] = await Promise.all([Usuario.find({}, 'nombre apellido genero dni nacimiento celular email esmedico img')
            .populate('especialidad','nombre')
            .skip( desde ),

        Usuario.countDocuments()
    ]);


    res.json({
        ok: true,
        usuarios,
        total
    });

}

const crearUsuario = async(req, res = response) => {

    const { email, password, dni } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const existedni = await Usuario.findOne({ dni });

        if ( existedni ) {
            return res.status(400).json({
                ok: false,
                msg: 'El dni ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );
    
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
    
    
        // Guardar usuario
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );


        res.json({
            ok: true,
            usuario,
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


const actualizarUsuario = async (req, res = response) => {

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
        const { password, dni, email, ...campos } = req.body;

        //VALIDACION EMAIL NO PUEDE SER IGUAL A UNO DE LA BD 
        if ( usuarioDB.email !== email ) {
            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        //VALIDACION DNI NO PUEDE SER IGUAL A UNO DE LA BD 
        if ( usuarioDB.dni !== dni ) {
            const existeDni = await Usuario.findOne({ dni });
            if ( existeDni ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese dni'
                });
            }
        }

        campos.password = password;
        campos.dni = dni;
        campos.email = email;

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
        
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


const borrarUsuario = async(req, res = response ) => {

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
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}