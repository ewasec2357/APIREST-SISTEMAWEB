const { response } = require('express');
const Especialidad = require('../models/especialidad');

//const Especialidad = require('../models/especialidad');


const getEspecialidad = async(req, res = response) => {

    const desde = Number(req.query.desde) || 0;

    const [ especialidad, total ] = await Promise.all([
        Especialidad
            .find({}, 'nombre estado')
            .skip( desde ),
        Especialidad.countDocuments()
    ]);

    res.json({
        ok: true,
        especialidad,
        total
    });
}

const crearEspecialidad = async(req, res = response) => {

   /* const {name} = req.body;

    

        const especialidadexiste = await Especialidad.findOne({ name });

        if ( especialidadexiste ) {
            return res.status(400).json({
                ok: false,
                msg: 'La especialidad ya está registrada'
            });
        }; */
        try {
    const especialidad = new Especialidad( req.body );

    await especialidad.save();

    res.json({
        ok: true,
        especialidad
    });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const actualizarEspecialidad = async (req, res = response) => {
    
    const uid = req.params.id;


    try {

        const especialidadDB = await Especialidad.findById( uid );
        if ( !especialidadDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe la especialidad por ese id'
            });
        }
        // Actualizaciones
        const { nombre, estado, ...campos } = req.body;
        if ( especialidadDB.nombre !== nombre ) {
            const existespecialidad = await Especialidad.findOne({ nombre });
            if ( existespecialidad ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe una especialidad con ese nombre'
                });
            }
        }
        campos.nombre = nombre;
        const especialidadActualizada = await Especialidad.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            especialidad: especialidadActualizada
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarEspecialidad = async (req, res = response) => {

    const uid = req.params.id;

    try {

        const especialidadDB = await Especialidad.findById( uid );

        if ( !especialidadDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe especialidad por ese id'
            });
        }

        await Especialidad.findByIdAndDelete( uid );

        
        res.json({
            ok: true,
            msg: 'Especialidad eliminada'
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
    getEspecialidad,
    crearEspecialidad,
    actualizarEspecialidad,
    borrarEspecialidad
}