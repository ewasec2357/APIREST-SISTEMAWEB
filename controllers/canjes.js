const { response } = require('express');
const Canjes = require('../models/canjes');


const getCanjes = async (req, res) => {

    const desde = Number(req.query.desde) || 0;

    const [ canjes, total ] = await Promise.all([Canjes.find({}, 
            'fechadecanje sesiones descripcion horario')
            .populate('cliente','nombre')
            .skip( desde ),
            Citas.countDocuments()
    ]);


    res.json({
        ok: true,
        canjes,
        total
    });

}

const crearCanjes = async(req, res) => {

    const uid = req.uid;
    const canjes = new Canjes({ cliente: uid, ...req.body });

    try {
       
        const canjesDB = await canjes.save();
        

        res.json({
            ok: true,
            canjesDB
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}

const actualizarCanjes = async (req, res = response) => {
    
    const id  = req.params.id;
    const uid = req.uid;
    
    try {
        const canjes = await Canjes.findById( id );

        if ( !canjes ) {
            return res.status(404).json({
                ok: true,
                msg: 'Canje no encontrado por id',
            });
        }

        const cambiosCanjes = { ...req.body, cliente: uid }

        const canjeActualizada = await Citas.findByIdandUpdate(id, cambiosCanjes,{ new: true })
                                            .populate('cliente','nombre')

        res.json({
            ok: true,
            cita: canjeActualizada
        })

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const borrarCanjes = async (req, res = response) => {

    const id  = req.params.id;

    try {
        
        const canjes = await Canjes.findById( id );

        if ( !canjes ) {
            return res.status(404).json({
                ok: true,
                msg: 'El canje no fue encontrada por id',
            });
        }

        await Canjes.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Canje borrada'
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
    getCanjes,
    crearCanjes,
    actualizarCanjes,
    borrarCanjes
}

