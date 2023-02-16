/*
    Citas
    ruta: '/api/citas'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const {
    getCitas,
    crearCitas,
    actualizarCita,
    borrarCita
} = require('../controllers/citas')


const router = Router();

router.get( '/', validarJWT, getCitas );

router.post( '/',
    [
        validarJWT,
    ], 
    crearCitas 
);

router.put( '/:id',
    [
        validarJWT,
    ],
    actualizarCita
);

router.delete( '/:id',
    [
        validarJWT,
    ],
    borrarCita
);



module.exports = router;