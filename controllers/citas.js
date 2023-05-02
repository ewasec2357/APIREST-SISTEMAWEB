const { response } = require('express');
const Citas = require('../models/citas');


const getCitas = async(req, res) => {

    const desde = Number(req.query.desde) || 0;

    const [ citas, total ] = await Promise.all([Citas.find({}, 'horario')
            .populate('cliente','nombre')
            .populate('especialidad','nombre')
            .populate('doctor','nombre')
            .skip( desde ),

        Citas.countDocuments()
    ]);


    res.json({
        ok: true,
        citas,
        total
    });

}

const crearCitas = async(req, res) => {

    const uid = req.uid;
    const citas = new Citas({ usuario: uid, especialidad: uid, cliente: uid, ...req.body })                    

    try {
       
        const citasDB = await citas.save()

        res.json({
            ok: true,
            citasDB
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const actualizarCita = async (req, res = response) => {
    
    const id  = req.params.id;
    const uid = req.uid;
    
    try {
        const citas = await Citas.findById( id );

        if ( !citas ) {
            return res.status(404).json({
                ok: true,
                msg: 'Cita no encontrado por id',
            });
        }

        const cambiosCita = { 
            ...req.body,
             usuario: uid }

        const citaActualizada = await Citas.findByIdAndUpdate( id, cambiosCita, { new: true } )
                                                             .populate('cliente','nombre')
                                                             .populate('especialidad','nombre')
                                                             .populate('doctor','nombre');

        res.json({
            ok: true,
            cita: citaActualizada
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const borrarCita = async (req, res = response) => {

    const id  = req.params.id;

    try {
        
        const citas = await Citas.findById( id );

        if ( !citas ) {
            return res.status(404).json({
                ok: true,
                msg: 'La cita no fue encontrada por id',
            });
        }

        await Citas.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Cita borrada'
        }); 

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}


module.exports = {
    getCitas,
    crearCitas,
    actualizarCita,
    borrarCita
}

