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
    const citas = new Citas({ usuario: uid, especialidad: uid, cliente: uid, ...req.body });

    try {
        
        const citasDB = await citas.save();
        

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

const actualizarCita = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizarMedico'
    })
}

const borrarCita = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'borrarMedico'
    })
}

module.exports = {
    getCitas,
    crearCitas,
    actualizarCita,
    borrarCita
}

